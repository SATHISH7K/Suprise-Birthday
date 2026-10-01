import express from 'express';

const app = express();

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// In-memory store for serverless execution
const surprisesStore: Record<string, any> = {};

// Save or update surprise data
app.post('/api/surprises', (req, res) => {
  try {
    const surprise = req.body;
    const surpriseId = surprise.id || `bday-${Math.random().toString(36).substring(2, 9)}`;
    
    surprisesStore[surpriseId] = {
      ...surprise,
      id: surpriseId,
      updatedAt: new Date().toISOString(),
    };
    
    res.json({ success: true, id: surpriseId });
  } catch (err: any) {
    console.error('Failed to save surprise:', err);
    res.status(500).json({ error: err.message || 'Failed to save surprise' });
  }
});

// Retrieve surprise data for recipient
app.get('/api/surprises/:id', (req, res) => {
  try {
    const surprise = surprisesStore[req.params.id];
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

export default app;
