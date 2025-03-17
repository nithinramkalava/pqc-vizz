// Type definitions for pqc module
declare module 'pqc' {
  // Common types
  type KeyPair = {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  };

  // ML-KEM (FIPS 203) - Key Encapsulation
  export const ml_kem: {
    ml_kem512: {
      keygen: () => KeyPair;
      encapsulate: (publicKey: Uint8Array) => { cipherText: Uint8Array; sharedSecret: Uint8Array };
      decapsulate: (cipherText: Uint8Array, secretKey: Uint8Array) => Uint8Array;
    };
    ml_kem768: {
      keygen: () => KeyPair;
      encapsulate: (publicKey: Uint8Array) => { cipherText: Uint8Array; sharedSecret: Uint8Array };
      decapsulate: (cipherText: Uint8Array, secretKey: Uint8Array) => Uint8Array;
    };
    ml_kem1024: {
      keygen: () => KeyPair;
      encapsulate: (publicKey: Uint8Array) => { cipherText: Uint8Array; sharedSecret: Uint8Array };
      decapsulate: (cipherText: Uint8Array, secretKey: Uint8Array) => Uint8Array;
    };
  };

  // ML-DSA (FIPS 204) - Digital Signatures
  // NOTE: Messages for signing must be exactly 4032 bytes
  export const ml_dsa: {
    ml_dsa44: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
    ml_dsa65: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
    ml_dsa87: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
  };

  // SLH-DSA (FIPS 205) - Digital Signatures
  // NOTE: Messages for signing must be exactly 64 bytes
  export const slh_dsa: {
    [key: string]: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
    // These are a subset of the available parameters
    slh_dsa_sha2_128f: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
    slh_dsa_shake_128f: {
      keygen: () => KeyPair;
      sign: (secretKey: Uint8Array, message: Uint8Array) => Uint8Array;
      verify: (publicKey: Uint8Array, message: Uint8Array, signature: Uint8Array) => boolean;
    };
  };
}

declare module 'pqc/utilities/utils' {
  // Utility functions
  export function utf8ToBytes(str: string): Uint8Array;
  export function concatBytes(...arrays: Uint8Array[]): Uint8Array;
  export function ensureBytes(bytes: Uint8Array, ...expectedLengths: number[]): void;
  export function randomBytes(length: number): Uint8Array;
  export function equalBytes(a: Uint8Array, b: Uint8Array): boolean;
} 