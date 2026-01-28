export async function hashPassword(password) {
  // Use Web Crypto API for password hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Hash password with salt using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  // Combine salt and hash
  const hashArray = new Uint8Array(hash);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

export async function comparePassword(password, hashedPassword) {
  try {
    // Decode base64
    const combined = new Uint8Array(
      atob(hashedPassword).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract salt (first 16 bytes)
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Hash input password with same salt
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      data,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    const hashArray = new Uint8Array(hash);
    
    // Compare hashes
    if (hashArray.length !== storedHash.length) {
      return false;
    }
    
    for (let i = 0; i < hashArray.length; i++) {
      if (hashArray[i] !== storedHash[i]) {
        return false;
      }
    }
    
    return true;
    
  } catch (error) {
    return false;
  }
}
