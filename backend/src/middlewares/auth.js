import { jwtVerify } from '../utils/jwt';
import { errorResponse, corsHeaders } from '../utils/router';

export async function authMiddleware(context) {
  const { request, env } = context;
  
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Unauthorized - No token provided' 
    }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = await jwtVerify(token, env.JWT_SECRET);
    context.user = payload;
    return; // Continue to next middleware/handler
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Unauthorized - Invalid token' 
    }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

export async function adminOnly(context) {
  const { user } = context;
  
  if (!user || user.role !== 'admin') {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Forbidden - Admin access required' 
    }), { 
      status: 403, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  return;
}
