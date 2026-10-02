import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Generous JSON limits for audio base64 data URLs and custom photo uploads
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // File-based persistence directory for stored surprises
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const surprisesFile = path.join(dataDir, 'surprises.json');

  const getSurprises = (): Record<string, any> => {
    try {
      if (fs.existsSync(surprisesFile)) {
        const content = fs.readFileSync(surprisesFile, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('Error reading surprises.json:', err);
    }
    return {};
  };

  const saveSurprises = (data: Record<string, any>) => {
    try {
      fs.writeFileSync(surprisesFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing surprises.json:', err);
    }
  };

  // API Route: Save or update surprise data
  app.post('/api/surprises', (req, res) => {
    try {
      const surprise = req.body;
      const surpriseId = surprise.id || `bday-${Math.random().toString(36).substring(2, 9)}`;
      const allSurprises = getSurprises();

      allSurprises[surpriseId] = {
        ...surprise,
        id: surpriseId,
        updatedAt: new Date().toISOString(),
      };

      saveSurprises(allSurprises);
      res.json({ success: true, id: surpriseId });
    } catch (err: any) {
      console.error('Failed to save surprise:', err);
      res.status(500).json({ error: err.message || 'Failed to save surprise' });
    }
  });

  // API Route: Retrieve surprise data for recipient
  app.get('/api/surprises/:id', (req, res) => {
    try {
      const allSurprises = getSurprises();
      const surprise = allSurprises[req.params.id];
      if (surprise) {
        res.json(surprise);
      } else {
        res.status(404).json({ error: 'Surprise not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Integration with Vite
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
