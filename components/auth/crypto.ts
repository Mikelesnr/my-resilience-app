/**
 * Hashes a plaintext password using native PBKDF2 via the Web Crypto API.
 * If no salt is provided, a fresh cryptographic salt is automatically generated.
 */
export async function hashPassword(
  password: string,
  providedSalt?: string,
): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  let saltBuffer: Uint8Array;
  if (providedSalt) {
    const matches = providedSalt.match(/.{1,2}/g);
    if (!matches) throw new Error("Invalid salt format string.");
    saltBuffer = new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
  } else {
    // Generate a fresh 16-byte cryptographically secure random salt
    saltBuffer = window.crypto.getRandomValues(new Uint8Array(16));
  }

  // Import raw password string into key material
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  // Derive a 256-bit key using PBKDF2
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      // Force TS to accept it as a standard BufferSource, bypassing the SharedArrayBuffer checks
      salt: saltBuffer as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"],
  );

  const exportedKey = await window.crypto.subtle.exportKey("raw", derivedKey);
  const hashArray = new Uint8Array(exportedKey);

  // Format buffers into readable hex strings for storage in Dexie
  const hashHex = Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const saltHex = Array.from(saltBuffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { hash: hashHex, salt: saltHex };
}
