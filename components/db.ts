import Dexie, { type Table } from "dexie";

export interface JournalEntry {
  id?: number;
  userId: number; // Links to the user's ID
  content: string; // The text of your appreciation note
  date: string; // ISO string date
}

// Define the User interface with secure password hashing fields
export interface LocalUser {
  id?: number;
  name: string;
  passwordHash?: string; // Used for client-side Web Crypto verification
  salt?: string; // Unique cryptographic salt per user
  createdAt: string;
}

// Define the WellnessLog interface with the userId relation
export interface WellnessLog {
  id?: number;
  userId: number; // Links the entry to the logged-in user's primary ID
  date: string;
  stressBefore: number;
  stressAfter: number;
  notes: string;
}

class CommunityWellnessDatabase extends Dexie {
  users!: Table<LocalUser>;
  history!: Table<WellnessLog>;
  journals!: Table<JournalEntry>;

  constructor() {
    super("CommunityWellnessDB");

    // Versioning the schema. Upgraded to version 3 to support hash properties.
    this.version(3).stores({
      users: "++id, &name", // Unique names prevent account mix-ups
      history: "++id, userId, date",
      journals: "++id, userId, date",
    });
  }
}

export const db = new CommunityWellnessDatabase();
