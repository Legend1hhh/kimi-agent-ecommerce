import { Router, jsonResponse, errorResponse, successResponse, corsHeaders } from '../utils/router';
import { jwtSign } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';

const router = new Router();

// Register
router.post('/register', async (context) => {
  const { request, env } = context;
  
  try {
    const { email, password, firstName, lastName, phone } = await request.json();
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return errorResponse('Please provide all required fields');
    }
    
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters');
    }
    
    // Check if user exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'customer', ?, ?)
    `).bind(userId, email, hashedPassword, firstName, lastName, phone || null, now, now).run();
    
    // Generate token
    const token = await jwtSign(
      { userId, email, role: 'customer' },
      env.JWT_SECRET,
      '7d'
    );
    
    return successResponse({
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        phone,
        role: 'customer'
      },
      token
    }, 'Registration successful');
    
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Registration failed', 500);
  }
});

// Login
router.post('/login', async (context) => {
  const { request, env } = context;
  
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return errorResponse('Please provide email and password');
    }
    
    // Find user
    const user = await env.DB.prepare(`
      SELECT id, email, password, first_name, last_name, phone, role, avatar
      FROM users WHERE email = ?
    `).bind(email).first();
    
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }
    
    // Verify password
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      return errorResponse('Invalid credentials', 401);
    }
    
    // Generate token
    const token = await jwtSign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      '7d'
    );
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      },
      token
    }, 'Login successful');
    
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
});

// Get profile
router.get('/profile', async (context) => {
  const { env, user } = context;
  
  try {
    const profile = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, phone, avatar, role, created_at
      FROM users WHERE id = ?
    `).bind(user.userId).first();
    
    if (!profile) {
      return errorResponse('User not found', 404);
    }
    
    return successResponse({
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone,
      avatar: profile.avatar,
      role: profile.role,
      createdAt: profile.created_at
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse('Failed to get profile', 500);
  }
});

// Update profile
router.put('/profile', async (context) => {
  const { request, env, user } = context;
  
  try {
    const { firstName, lastName, phone, avatar } = await request.json();
    
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      UPDATE users 
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          phone = COALESCE(?, phone),
          avatar = COALESCE(?, avatar),
          updated_at = ?
      WHERE id = ?
    `).bind(firstName, lastName, phone, avatar, now, user.userId).run();
    
    return successResponse({
      firstName,
      lastName,
      phone,
      avatar
    }, 'Profile updated successfully');
    
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse('Failed to update profile', 500);
  }
});

// Change password
router.put('/change-password', async (context) => {
  const { request, env, user } = context;
  
  try {
    const { currentPassword, newPassword } = await request.json();
    
    // Get current password
    const userRecord = await env.DB.prepare(
      'SELECT password FROM users WHERE id = ?'
    ).bind(user.userId).first();
    
    if (!userRecord) {
      return errorResponse('User not found', 404);
    }
    
    // Verify current password
    const isValid = await comparePassword(currentPassword, userRecord.password);
    
    if (!isValid) {
      return errorResponse('Current password is incorrect', 400);
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    await env.DB.prepare(
      'UPDATE users SET password = ?, updated_at = ? WHERE id = ?'
    ).bind(hashedPassword, new Date().toISOString(), user.userId).run();
    
    return successResponse(null, 'Password changed successfully');
    
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse('Failed to change password', 500);
  }
});

// Forgot password
router.post('/forgot-password', async (context) => {
  const { request, env } = context;
  
  try {
    const { email } = await request.json();
    
    // In production, send email with reset link
    // For now, just return success
    
    return successResponse(null, 'If an account exists, a reset link has been sent');
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse('Failed to process request', 500);
  }
});

export default router;
