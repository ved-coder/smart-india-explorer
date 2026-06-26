import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all regions (summary lists)
router.get('/', (req, res) => {
  try {
    const regions = db.getRegions();
    // Return a simplified version for the index list
    const summary = regions.map(r => ({
      id: r.id,
      name: r.name,
      capital: r.capital,
      description: r.description,
      languages: r.languages
    }));
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve regions: ' + error.message });
  }
});

// GET specific region details
router.get('/:id', (req, res) => {
  try {
    const region = db.getRegionById(req.params.id);
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve region details: ' + error.message });
  }
});

export default router;
