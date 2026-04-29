import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthPayload, User } from '@/types/auth';
import { supabaseServer } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'hospital-service-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'hospital-service-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate access token (short-lived, 15 minutes)
 */
export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate refresh token (long-lived, 7 days)
 */
export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, first_name, last_name, phone_number, user_type, is_active, created_at, updated_at')
    .eq('email', email)
    .single();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone_number,
    userType: user.user_type,
    isActive: user.is_active,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
  };
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, first_name, last_name, phone_number, user_type, is_active, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone_number,
    userType: user.user_type,
    isActive: user.is_active,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
  };
}

/**
 * Create new user (registration)
 */
export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(data.password);
    
    const { data: user, error } = await supabaseServer
      .from('users')
      .insert([{
        email: data.email,
        password_hash: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber || null,
        user_type: data.userType,
        date_of_birth: data.dateOfBirth || null,
        gender: data.gender || null,
        address: data.address || null,
        is_active: true
      }])
      .select('id, email, first_name, last_name, phone_number, user_type, is_active, created_at, updated_at')
      .single();

    if (error || !user) {
      console.error('Error creating user:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      userType: user.user_type,
      isActive: user.is_active,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Authenticate user (login)
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; passwordHash: string } | null> {
  try {
    const { data: result, error } = await supabaseServer
      .from('users')
      .select('id, email, password_hash, first_name, last_name, phone_number, user_type, is_active, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !result) {
      return null;
    }

    const passwordMatch = await comparePassword(password, result.password_hash);
    if (!passwordMatch) {
      return null;
    }

    const user: User = {
      id: result.id,
      email: result.email,
      firstName: result.first_name,
      lastName: result.last_name,
      phoneNumber: result.phone_number,
      userType: result.user_type,
      isActive: result.is_active,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    };

    return { user, passwordHash: result.password_hash };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}
