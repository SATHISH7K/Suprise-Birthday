import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

// Generous payload limits for compressed base64 images and recordings
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// CORS headers for all incoming requests
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Layer 1: In-memory cache
const surprisesStore: Record<string, any> = {};

// Layer 2: File-based persistence in /tmp (for serverless environments) and local data/
const getStorageFilePath = () => {
  try {
    const tmpPath = path.join('/tmp', 'surprises.json');
    if (fs.existsSync('/tmp')) {
      return tmpPath;
    }
  } catch {
    // Ignore
  }
  return path.resolve(process.cwd(), 'data', 'surprises.json');
};

const readFileStorage = (): Record<string, any> => {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[File Storage Read Error]:', err);
  }
  return {};
};

const writeFileStorage = (data: Record<string, any>) => {
  try {
    const filePath = getStorageFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[File Storage Write Error]:', err);
  }
};

// Layer 3: Upstash Redis / Vercel KV REST API Integration
const getKvConfig = () => {
  let url =
    process.env.STORAGE_REST_API_URL ||
    process.env.STORAGE_KV_REST_API_URL ||
    process.env.STORAGE_UPSTASH_REDIS_REST_URL ||
    process.env.STORAGE_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.VERCEL_KV_REST_API_URL;

  let token =
    process.env.STORAGE_REST_API_TOKEN ||
    process.env.STORAGE_KV_REST_API_TOKEN ||
    process.env.STORAGE_UPSTASH_REDIS_REST_TOKEN ||
    process.env.STORAGE_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.VERCEL_KV_REST_API_TOKEN;

  // Dynamic fallback scan for any custom prefix
  if (!url || !token) {
    for (const [k, v] of Object.entries(process.env)) {
      if (!v) continue;
      if (!url && (k.endsWith('_REST_API_URL') || k.endsWith('_REDIS_REST_URL') || k.endsWith('_URL')) && v.startsWith('http')) {
        url = v;
      }
      if (!token && (k.endsWith('_REST_API_TOKEN') || k.endsWith('_REDIS_REST_TOKEN') || k.endsWith('_TOKEN')) && v.length > 15) {
        token = v;
      }
    }
  }

  return { url, token, isConfigured: Boolean(url && token) };
};

const saveToCloudKv = async (key: string, value: any): Promise<boolean> => {
  const { url, token, isConfigured } = getKvConfig();
  if (!isConfigured || !url || !token) return false;

  try {
    const safeKey = encodeURIComponent(key);
    const response = await fetch(`${url}/set/${safeKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
    if (response.ok) {
      console.log(`[Cloud KV] Successfully saved surprise: ${key}`);
    } else {
      console.warn(`[Cloud KV] Save failed with status: ${response.status}`);
    }
    return response.ok;
  } catch (err) {
    console.warn('[Cloud KV Set Error]:', err);
    return false;
  }
};

const getFromCloudKv = async (key: string): Promise<any | null> => {
  const { url, token, isConfigured } = getKvConfig();
  if (!isConfigured || !url || !token) return null;

  try {
    const safeKey = encodeURIComponent(key);
    const response = await fetch(`${url}/get/${safeKey}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.result !== null && data.result !== undefined) {
      console.log(`[Cloud KV] Successfully retrieved surprise: ${key}`);
      if (typeof data.result === 'string') {
        try {
          return JSON.parse(data.result);
        } catch {
          return data.result;
        }
      }
      return data.result;
    }
  } catch (err) {
    console.warn('[Cloud KV Get Error]:', err);
  }
  return null;
};

// Save or update surprise data
app.post(['/api/surprises', '/surprises'], async (req, res) => {
  try {
    const surprise = req.body;
    if (!surprise || typeof surprise !== 'object') {
      return res.status(400).json({ error: 'Invalid surprise payload' });
    }

    const surpriseId = surprise.id || `bday-${Math.random().toString(36).substring(2, 9)}`;
    const fullSurprise = {
      ...surprise,
      id: surpriseId,
      updatedAt: new Date().toISOString(),
    };

    // 1. Update in-memory
    surprisesStore[surpriseId] = fullSurprise;

    // 2. Update file storage
    try {
      const fileData = readFileStorage();
      fileData[surpriseId] = fullSurprise;
      writeFileStorage(fileData);
    } catch (e) {
      console.warn('File storage sync skipped:', e);
    }

    // 3. Update Cloud KV (Upstash/Vercel KV) if configured
    await saveToCloudKv(surpriseId, fullSurprise);

    return res.json({ success: true, id: surpriseId });
  } catch (err: any) {
    console.error('Failed to save surprise:', err);
    return res.status(500).json({ error: err.message || 'Failed to save surprise' });
  }
});

// Retrieve surprise data for recipient
app.get(['/api/surprises/:id', '/surprises/:id'], async (req, res) => {
  const surpriseId = req.params.id;
  try {
    // 1. Check in-memory
    if (surprisesStore[surpriseId]) {
      return res.json(surprisesStore[surpriseId]);
    }

    // 2. Check Cloud KV (Upstash/Vercel KV)
    const cloudData = await getFromCloudKv(surpriseId);
    if (cloudData) {
      surprisesStore[surpriseId] = cloudData;
      return res.json(cloudData);
    }

    // 3. Check File Storage (/tmp or local data)
    const fileData = readFileStorage();
    if (fileData[surpriseId]) {
      surprisesStore[surpriseId] = fileData[surpriseId];
      return res.json(fileData[surpriseId]);
    }

    // Return 404 — do NOT fall back to a different surprise
    return res.status(404).json({ error: 'Surprise not found' });
  } catch (err: any) {
    console.error('Failed to get surprise:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get(['/api/health', '/health'], (_req, res) => {
  const { isConfigured } = getKvConfig();
  res.json({
    status: 'ok',
    cloudKvConfigured: isConfigured,
    timestamp: new Date().toISOString(),
  });
});

export default app;
