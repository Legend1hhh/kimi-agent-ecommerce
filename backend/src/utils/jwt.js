import { SignJWT, jwtVerify as joseJwtVerify } from 'jose';

export async function jwtSign(payload, secret, expiresIn = '7d') {
  const encoder = new TextEncoder();
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encoder.encode(secret));
  
  return jwt;
}

export async function jwtVerify(token, secret) {
  const encoder = new TextEncoder();
  const { payload } = await joseJwtVerify(token, encoder.encode(secret));
  return payload;
}
