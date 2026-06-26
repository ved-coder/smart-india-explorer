import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.join(DATA_DIR, 'seedData.json');

// Ensure database is initialized
export function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    let regions = [];
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedContent = fs.readFileSync(SEED_FILE, 'utf8');
        regions = JSON.parse(seedContent);
      } catch (err) {
        console.error('Error reading seedData.json:', err);
      }
    } else {
      console.warn('seedData.json not found in data directory.');
    }

    const initialDb = {
      regions: regions,
      itineraries: [],
      users: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
    console.log('Database initialized and seeded.');
  } else {
    // Verify schema consistency
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      const dbData = JSON.parse(content);
      let updated = false;

      if (!dbData.regions || dbData.regions.length === 0) {
        if (fs.existsSync(SEED_FILE)) {
          const seedContent = fs.readFileSync(SEED_FILE, 'utf8');
          dbData.regions = JSON.parse(seedContent);
          updated = true;
        }
      }

      if (!dbData.users) {
        dbData.users = [];
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
        console.log('Database schema aligned.');
      }
    } catch (err) {
      console.error('Error verifying database:', err);
    }
  }
}

// Read helper
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initDb();
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { regions: [], itineraries: [], users: [] };
  }
}

// Write helper
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err);
    return false;
  }
}

// Database Operations
export const db = {
  getRegions: () => {
    const data = readDb();
    return data.regions || [];
  },

  getRegionById: (id) => {
    const data = readDb();
    return (data.regions || []).find(r => r.id === id);
  },

  // User Auth operations
  getUsers: () => {
    const data = readDb();
    return data.users || [];
  },

  getUserByUsername: (username) => {
    const data = readDb();
    return (data.users || []).find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  saveUser: (user) => {
    const data = readDb();
    if (!data.users) {
      data.users = [];
    }
    const newUser = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...user
    };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  // Itinerary operations (filtered by user)
  getItineraries: (userId) => {
    const data = readDb();
    const list = data.itineraries || [];
    if (!userId) return list;
    return list.filter(item => item.userId === userId);
  },

  saveItinerary: (itinerary) => {
    const data = readDb();
    if (!data.itineraries) {
      data.itineraries = [];
    }
    
    const newItinerary = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...itinerary
    };
    
    data.itineraries.push(newItinerary);
    writeDb(data);
    return newItinerary;
  },

  deleteItinerary: (id) => {
    const data = readDb();
    if (!data.itineraries) return false;
    
    const originalLength = data.itineraries.length;
    data.itineraries = data.itineraries.filter(item => item.id !== id);
    
    if (data.itineraries.length < originalLength) {
      writeDb(data);
      return true;
    }
    return false;
  }
};
