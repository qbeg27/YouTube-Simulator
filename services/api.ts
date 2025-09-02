
// Fix: Import User type for authentication functions.
import type { User } from '../types';

const DB_KEY = 'youtube_simulator_db';

// Fix: Add a simple hashing function for mock password storage.
// In a real app, use a proper library like bcrypt.
const simpleHash = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

// Fix: Add an interface for a user with a password hash.
interface UserWithPassword extends User {
    passwordHash: string;
}

// Fix: Update Database interface to include users.
interface Database {
  users: Record<string, UserWithPassword>;
  gameStates: Record<string, any>;
}

// --- Helper Functions to interact with localStorage "DB" ---

// Fix: Update readDb to handle the new structure and migrate from the old one.
const readDb = (): Database => {
  try {
    const dbJson = localStorage.getItem(DB_KEY);
    const data = dbJson ? JSON.parse(dbJson) : {};
    // Ensure both keys exist, even if migrating from old format
    return { users: data.users || {}, gameStates: data.gameStates || {} };
  } catch (e) {
    console.error("Failed to read from DB, resetting.", e);
    return { users: {}, gameStates: {} };
  }
};

const writeDb = (db: Database): void => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to write to DB.", e);
  }
};


// --- Mock API Functions ---

// Simulates network latency
const simulateDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// Fix: Implement the 'register' function.
/**
 * Registers a new user.
 */
export const register = async (username: string, password: string): Promise<User> => {
    await simulateDelay();
    const db = readDb();

    if (Object.values(db.users).some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username already exists.');
    }

    const userId = `user-${Date.now()}`;
    const newUser: UserWithPassword = {
        id: userId,
        username,
        passwordHash: simpleHash(password),
    };

    db.users[userId] = newUser;
    writeDb(db);

    const { passwordHash, ...userToReturn } = newUser;
    return userToReturn;
};

// Fix: Implement the 'login' function.
/**
 * Logs in a user.
 */
export const login = async (username: string, password: string): Promise<User> => {
    await simulateDelay();
    const db = readDb();
    const passwordHash = simpleHash(password);

    const user = Object.values(db.users).find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.passwordHash !== passwordHash) {
        throw new Error('Invalid username or password.');
    }

    const { passwordHash: _, ...userToReturn } = user;
    return userToReturn;
};

/**
 * Saves the game state for a given user.
 */
export const saveGameState = async (userId: string, state: any): Promise<void> => {
  // No delay on save to make it feel snappy in the background
  const db = readDb();
  db.gameStates[userId] = state;
  writeDb(db);
  console.log("Game state saved for user:", userId);
};

/**
 * Retrieves the game state for a given user.
 */
export const getGameState = async (userId: string): Promise<any | null> => {
  await simulateDelay();
  const db = readDb();
  return db.gameStates[userId] || null;
};
