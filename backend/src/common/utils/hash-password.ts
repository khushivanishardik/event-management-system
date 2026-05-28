// Location: backend/src/common/utils/hash-password.ts
// Purpose: Utility functions for hashing and comparing passwords using bcrypt.
//          Salt rounds set to 12 for a good security/performance balance.

import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param password - Plain text password from signup/update request
 * @returns Bcrypt hashed string to store in MongoDB
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored hash.
 * @param password - Plain text password from login request
 * @param hash     - Stored bcrypt hash from database
 * @returns true if passwords match
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
