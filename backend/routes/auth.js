import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// SIGN UP Endpoint
router.post('/signup', (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Please enter all fields: Username, Name, and Password.' });
    }

    const existingUser = db.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken. Please choose another.' });
    }

    const newUser = db.saveUser({
      username: username.trim(),
      name: name.trim(),
      password: password // In a real app we'd hash this (e.g. bcrypt), but plain text is fine for local developer prototype
    });

    // Return user without password
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      createdAt: newUser.createdAt
    };

    console.log(`[User registered] username: ${userResponse.username}`);
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account: ' + error.message });
  }
});

// SIGN IN Endpoint
router.post('/signin', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please enter Username and Password.' });
    }

    const user = db.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid Username or Password.' });
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt
    };

    console.log(`[User logged in] username: ${userResponse.username}`);
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign in: ' + error.message });
  }
});

export default router;
