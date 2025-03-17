// Test file for PQC module behavior

import { ml_kem, ml_dsa, slh_dsa } from 'pqc';

function testMLKEM() {
  console.log("=== Testing ML-KEM with Different Security Levels ===");
  
  // Generate keys with different security levels
  console.log("Generating ML-KEM keys at different security levels...");
  const keys512 = ml_kem.ml_kem512.keygen();
  const keys768 = ml_kem.ml_kem768.keygen();
  const keys1024 = ml_kem.ml_kem1024.keygen();
  
  // Generate shared secrets with each key
  console.log("Generating shared secrets...");
  const { cipherText: ct512, sharedSecret: ss512 } = ml_kem.ml_kem512.encapsulate(keys512.publicKey);
  const { cipherText: ct768, sharedSecret: ss768 } = ml_kem.ml_kem768.encapsulate(keys768.publicKey);
  const { sharedSecret: ss1024 } = ml_kem.ml_kem1024.encapsulate(keys1024.publicKey);
  
  // Try decapsulation with the wrong security level
  console.log("\nCross-checking decapsulation with different security levels (should all fail):");
  
  try {
    ml_kem.ml_kem768.decapsulate(ct512, keys768.secretKey);
    console.log("Security issue: ML-KEM-768 can decapsulate ML-KEM-512 ciphertext!");
  } catch {
    console.log("Good: ML-KEM-768 correctly fails to decapsulate ML-KEM-512 ciphertext");
  }
  
  try {
    ml_kem.ml_kem512.decapsulate(ct768, keys512.secretKey);
    console.log("Security issue: ML-KEM-512 can decapsulate ML-KEM-768 ciphertext!");
  } catch {
    console.log("Good: ML-KEM-512 correctly fails to decapsulate ML-KEM-768 ciphertext");
  }
  
  // Test encryption with XOR at different security levels
  console.log("\nTesting message encryption with different security levels:");
  
  // Create a test message
  const message = "This is a test message";
  const messageBytes = new TextEncoder().encode(message);
  
  // Encrypt with different security levels
  console.log("Encrypting message with different security level shared secrets...");
  const encrypted512 = xorEncrypt(messageBytes, ss512);
  const encrypted768 = xorEncrypt(messageBytes, ss768);
  
  // Try decryption with the wrong shared secret
  const dec_512_768 = new TextDecoder().decode(xorEncrypt(encrypted512, ss768));
  const dec_768_512 = new TextDecoder().decode(xorEncrypt(encrypted768, ss512));
  
  console.log("Decrypting ML-KEM-512 message with ML-KEM-768 shared secret:", dec_512_768);
  console.log("Does it match original message?", dec_512_768 === message);
  
  console.log("Decrypting ML-KEM-768 message with ML-KEM-512 shared secret:", dec_768_512);
  console.log("Does it match original message?", dec_768_512 === message);
  
  // Check if shared secrets are different lengths
  console.log("\nShared Secret Lengths:");
  console.log("ML-KEM-512 shared secret length:", ss512.length);
  console.log("ML-KEM-768 shared secret length:", ss768.length);
  console.log("ML-KEM-1024 shared secret length:", ss1024.length);
}

function testMLDSA() {
  console.log("\n=== Testing ML-DSA with Different Security Levels ===");
  
  // Generate keys with different security levels
  console.log("Generating ML-DSA keys at different security levels...");
  const keys44 = ml_dsa.ml_dsa44.keygen();
  const keys65 = ml_dsa.ml_dsa65.keygen();
  const keys87 = ml_dsa.ml_dsa87.keygen();
  
  // Create a test message
  const message = "This is a test message for ML-DSA";
  const messageBytes = new TextEncoder().encode(message);
  
  // Sign with different security levels
  console.log("Signing message with different security levels...");
  const sig44 = ml_dsa.ml_dsa44.sign(keys44.secretKey, messageBytes);
  const sig65 = ml_dsa.ml_dsa65.sign(keys65.secretKey, messageBytes);
  const sig87 = ml_dsa.ml_dsa87.sign(keys87.secretKey, messageBytes);
  
  // Verify with correct key pairs
  console.log("\nVerifying signatures with correct key pairs (should all succeed):");
  console.log("ML-DSA-44 verify:", ml_dsa.ml_dsa44.verify(keys44.publicKey, messageBytes, sig44));
  console.log("ML-DSA-65 verify:", ml_dsa.ml_dsa65.verify(keys65.publicKey, messageBytes, sig65));
  console.log("ML-DSA-87 verify:", ml_dsa.ml_dsa87.verify(keys87.publicKey, messageBytes, sig87));
  
  // Try to verify with wrong security levels
  console.log("\nCross-checking verification with different security levels (should all fail):");
  console.log("ML-DSA-65 verifying ML-DSA-44 signature:", ml_dsa.ml_dsa65.verify(keys65.publicKey, messageBytes, sig44));
  console.log("ML-DSA-44 verifying ML-DSA-65 signature:", ml_dsa.ml_dsa44.verify(keys44.publicKey, messageBytes, sig65));
  
  // Check signature sizes
  console.log("\nSignature Lengths:");
  console.log("ML-DSA-44 signature length:", sig44.length);
  console.log("ML-DSA-65 signature length:", sig65.length);
  console.log("ML-DSA-87 signature length:", sig87.length);
}

function testSLHDSA() {
  console.log("\n=== Testing SLH-DSA with Different Security Levels ===");
  
  // Generate keys with different security levels
  console.log("Generating SLH-DSA keys at different security levels...");
  const keys128s = slh_dsa.slh_dsa_sha2_128s.keygen();
  const keys256s = slh_dsa.slh_dsa_sha2_256s.keygen();
  
  // Create a test message
  const message = "This is a test message for SLH-DSA";
  const messageBytes = new TextEncoder().encode(message);
  
  // Sign with different security levels
  console.log("Signing message with different security levels...");
  const sig128s = slh_dsa.slh_dsa_sha2_128s.sign(keys128s.secretKey, messageBytes);
  const sig256s = slh_dsa.slh_dsa_sha2_256s.sign(keys256s.secretKey, messageBytes);
  
  // Verify with correct key pairs
  console.log("\nVerifying signatures with correct key pairs (should succeed):");
  console.log("SLH-DSA-SHA2-128s verify:", slh_dsa.slh_dsa_sha2_128s.verify(keys128s.publicKey, messageBytes, sig128s));
  console.log("SLH-DSA-SHA2-256s verify:", slh_dsa.slh_dsa_sha2_256s.verify(keys256s.publicKey, messageBytes, sig256s));
  
  // Try to verify with wrong security levels
  console.log("\nCross-checking verification with different security levels (should fail):");
  console.log("SLH-DSA-SHA2-256s verifying SLH-DSA-SHA2-128s signature:", slh_dsa.slh_dsa_sha2_256s.verify(keys256s.publicKey, messageBytes, sig128s));
  console.log("SLH-DSA-SHA2-128s verifying SLH-DSA-SHA2-256s signature:", slh_dsa.slh_dsa_sha2_128s.verify(keys128s.publicKey, messageBytes, sig256s));
  
  // Check signature sizes
  console.log("\nSignature Lengths:");
  console.log("SLH-DSA-SHA2-128s signature length:", sig128s.length);
  console.log("SLH-DSA-SHA2-256s signature length:", sig256s.length);
}

// Helper function for XOR encryption
function xorEncrypt(data, key) {
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
}

// Run all tests
console.log("Running PQC module tests...");
testMLKEM();
testMLDSA();
testSLHDSA();
console.log("\nTests completed."); 