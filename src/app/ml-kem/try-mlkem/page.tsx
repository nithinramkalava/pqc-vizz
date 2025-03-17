'use client';

import React, { useState, useEffect } from 'react';
import { ml_kem } from 'pqc';
import Link from 'next/link';

// Binary visualizer component
const BinaryVisualizer = ({ data, maxBits = 512 }: { data: Uint8Array | null, maxBits?: number }) => {
  if (!data) return null;
  
  // Convert bytes to bits
  const bits: boolean[] = [];
  for (let i = 0; i < Math.min(data.length, Math.ceil(maxBits / 8)); i++) {
    const byte = data[i];
    for (let bit = 7; bit >= 0; bit--) {
      if (bits.length < maxBits) {
        bits.push(Boolean((byte >> bit) & 1));
      }
    }
  }
  
  return (
    <div className="mt-3 grid grid-cols-8 gap-[1px] bg-secondary-100 p-1 rounded-md overflow-hidden">
      {bits.map((bit, i) => (
        <div 
          key={i} 
          className={`h-3 w-full ${bit ? 'bg-primary-600' : 'bg-secondary-200'}`}
          title={`Bit ${i}: ${bit ? '1' : '0'}`}
        />
      ))}
      {data.length * 8 > maxBits && (
        <div className="col-span-8 text-xs text-center text-secondary-600 mt-1">
          Showing first {maxBits} of {data.length * 8} bits
        </div>
      )}
    </div>
  );
};

export default function TryMLKEMPage() {
  const [securityLevel, setSecurityLevel] = useState<'ml_kem512' | 'ml_kem768' | 'ml_kem1024'>('ml_kem512');
  const [keyPair, setKeyPair] = useState<{publicKey: Uint8Array, secretKey: Uint8Array} | null>(null);
  const [cipherText, setCipherText] = useState<Uint8Array | null>(null);
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [decapsulatedSecret, setDecapsulatedSecret] = useState<Uint8Array | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // AES encryption states
  const [plaintext, setPlaintext] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  
  // Expanded states
  const [expandedPublicKey, setExpandedPublicKey] = useState(false);
  const [expandedSecretKey, setExpandedSecretKey] = useState(false);
  const [expandedCipherText, setExpandedCipherText] = useState(false);
  const [expandedSharedSecret, setExpandedSharedSecret] = useState(false);
  const [expandedDecapsulatedSecret, setExpandedDecapsulatedSecret] = useState(false);

  // Binary visualization states
  const [showBinaryPublicKey, setShowBinaryPublicKey] = useState(false);
  const [showBinarySecretKey, setShowBinarySecretKey] = useState(false);
  const [showBinaryCipherText, setShowBinaryCipherText] = useState(false);
  const [showBinarySharedSecret, setShowBinarySharedSecret] = useState(false);
  const [showBinaryDecapsulatedSecret, setShowBinaryDecapsulatedSecret] = useState(false);
  
  // Log function to track operations
  const log = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  // Reset all state when security level changes
  useEffect(() => {
    setKeyPair(null);
    setCipherText(null);
    setSharedSecret(null);
    setDecapsulatedSecret(null);
    setPlaintext('');
    setEncryptedMessage('');
    setDecryptInput('');
    setDecryptedText('');
    setExpandedPublicKey(false);
    setExpandedSecretKey(false);
    setExpandedCipherText(false);
    setExpandedSharedSecret(false);
    setExpandedDecapsulatedSecret(false);
    setShowBinaryPublicKey(false);
    setShowBinarySecretKey(false);
    setShowBinaryCipherText(false);
    setShowBinarySharedSecret(false);
    setShowBinaryDecapsulatedSecret(false);
    setLogs([`Security level changed to ${securityLevel}`]);
  }, [securityLevel]);

  // Generate new key pair
  const generateKeyPair = () => {
    try {
      const algorithm = ml_kem[securityLevel];
      const keys = algorithm.keygen();
      setKeyPair(keys);
      log(`Generated ${securityLevel} key pair`);
      log(`Public key length: ${keys.publicKey.length} bytes`);
      log(`Secret key length: ${keys.secretKey.length} bytes`);
    } catch (error) {
      log(`Error generating keys: ${error}`);
    }
  };

  // Encapsulate to create shared secret
  const encapsulate = () => {
    if (!keyPair) {
      log('No key pair available. Generate keys first.');
      return;
    }
    
    try {
      const algorithm = ml_kem[securityLevel];
      const { cipherText, sharedSecret } = algorithm.encapsulate(keyPair.publicKey);
      setCipherText(cipherText);
      setSharedSecret(sharedSecret);
      log(`Encapsulation successful`);
      log(`Ciphertext length: ${cipherText.length} bytes`);
      log(`Shared secret length: ${sharedSecret.length} bytes`);
    } catch (error) {
      log(`Encapsulation error: ${error}`);
    }
  };

  // Decapsulate to recover shared secret
  const decapsulate = () => {
    if (!keyPair || !cipherText) {
      log('Missing key pair or ciphertext. Generate keys and encapsulate first.');
      return;
    }
    
    try {
      const algorithm = ml_kem[securityLevel];
      const decapsulated = algorithm.decapsulate(cipherText, keyPair.secretKey);
      setDecapsulatedSecret(decapsulated);
      
      // Verify if decapsulated matches original shared secret
      if (sharedSecret) {
        const match = areUint8ArraysEqual(decapsulated, sharedSecret);
        log(`Decapsulation successful`);
        log(`Decapsulated secret length: ${decapsulated.length} bytes`);
        log(`Matches original shared secret: ${match ? 'YES' : 'NO'}`);
      }
    } catch (error) {
      log(`Decapsulation error: ${error}`);
    }
  };
  
  // AES encrypt using shared secret
  const encryptWithAES = () => {
    if (!sharedSecret || !plaintext) {
      log('Need shared secret and plaintext to encrypt');
      return;
    }
    
    try {
      // Convert the first 16 bytes of shared secret to AES key
      const keyBytes = sharedSecret.slice(0, 16); 
      const iv = sharedSecret.slice(16, 32); // Use next 16 bytes as IV
      
      log(`Using first 16 bytes of shared secret as AES key`);
      
      // Convert plaintext to ArrayBuffer
      const enc = new TextEncoder();
      const plaintextBytes = enc.encode(plaintext);
      
      // Encrypt with AES-GCM
      encryptAESGCM(keyBytes, iv, plaintextBytes).then(encrypted => {
        const encryptedHex = bytesToHex(encrypted);
        setEncryptedMessage(encryptedHex);
        log(`AES encryption successful`);
        log(`Encrypted message length: ${encrypted.length} bytes`);
      });
    } catch (error) {
      log(`AES encryption error: ${error}`);
    }
  };
  
  // AES decrypt using shared secret
  const decryptWithAES = () => {
    if (!sharedSecret || !decryptInput) {
      log('Need shared secret and encrypted message to decrypt');
      return;
    }
    
    try {
      // Convert the first 16 bytes of shared secret to AES key
      const keyBytes = sharedSecret.slice(0, 16);
      const iv = sharedSecret.slice(16, 32); // Use next 16 bytes as IV
      
      // Convert hex ciphertext back to bytes
      const ciphertextBytes = hexToBytes(decryptInput);
      
      // Decrypt with AES-GCM
      decryptAESGCM(keyBytes, iv, ciphertextBytes).then(decrypted => {
        const dec = new TextDecoder();
        const decryptedText = dec.decode(decrypted);
        setDecryptedText(decryptedText);
        log(`AES decryption successful`);
      }).catch(error => {
        log(`AES decryption failed: ${error.message}`);
        setDecryptedText('Decryption failed - Invalid ciphertext or wrong key');
      });
    } catch (error) {
      log(`AES decryption error: ${error}`);
    }
  };
  
  // Helper functions for AES encryption/decryption using Web Crypto API
  async function encryptAESGCM(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM', length: 128 },
      false,
      ['encrypt']
    );
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    return new Uint8Array(encrypted);
  }
  
  async function decryptAESGCM(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM', length: 128 },
      false,
      ['decrypt']
    );
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    return new Uint8Array(decrypted);
  }
  
  // Helper to compare Uint8Arrays
  const areUint8ArraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  
  // Convert Uint8Array to hex string for display
  const bytesToHex = (bytes: Uint8Array | null): string => {
    if (!bytes) return '';
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };
  
  // Convert hex string back to Uint8Array
  const hexToBytes = (hex: string): Uint8Array => {
    const hexChars = hex.match(/.{1,2}/g) || [];
    return new Uint8Array(hexChars.map(byte => parseInt(byte, 16)));
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        log(`Copied ${label} to clipboard`);
      },
      () => {
        log(`Failed to copy ${label} to clipboard`);
      }
    );
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/ml-kem" className="text-primary-100 hover:text-white flex items-center mb-6">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to ML-KEM
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">Interactive ML-KEM Key Exchange</h1>
          <p className="text-primary-100">
            Experience ML-KEM key exchange with AES encryption/decryption
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content - LEFT side */}
          <div className="md:w-2/3 space-y-8">
            {/* Security Level Selector */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">1. Select Security Level</h2>
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value as 'ml_kem512' | 'ml_kem768' | 'ml_kem1024')}
                className="w-full p-3 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ml_kem512">ML-KEM-512 (NIST Level 1, 128-bit security)</option>
                <option value="ml_kem768">ML-KEM-768 (NIST Level 3, 192-bit security)</option>
                <option value="ml_kem1024">ML-KEM-1024 (NIST Level 5, 256-bit security)</option>
              </select>
            </div>

            {/* Key Generation */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">2. Key Generation (Recipient)</h2>
              <p className="text-secondary-700 mb-4">
                Generate a key pair. In a real-world scenario, the recipient would generate a key pair and share the public key.
              </p>
              <button
                onClick={generateKeyPair}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Generate Key Pair
              </button>

              {keyPair && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                      <span>Public Key:</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setExpandedPublicKey(!expandedPublicKey)} 
                          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                        >
                          {expandedPublicKey ? "Collapse" : "Expand"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(bytesToHex(keyPair.publicKey), "Public Key")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedPublicKey 
                          ? bytesToHex(keyPair.publicKey)
                          : bytesToHex(keyPair.publicKey).substring(0, 64) + "..."}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{keyPair.publicKey.length} bytes</span>
                      <button 
                        onClick={() => setShowBinaryPublicKey(!showBinaryPublicKey)}
                        className="text-primary-600 hover:text-primary-800 underline text-xs"
                      >
                        {showBinaryPublicKey ? "Hide Lattice" : "Show Lattice"}
                      </button>
                    </div>
                    {showBinaryPublicKey && (
                      <BinaryVisualizer data={keyPair.publicKey} />
                    )}
                  </div>

                  <div>
                    <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                      <span>Secret Key:</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setExpandedSecretKey(!expandedSecretKey)} 
                          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                        >
                          {expandedSecretKey ? "Collapse" : "Expand"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(bytesToHex(keyPair.secretKey), "Secret Key")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedSecretKey 
                          ? bytesToHex(keyPair.secretKey)
                          : bytesToHex(keyPair.secretKey).substring(0, 64) + "..."}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{keyPair.secretKey.length} bytes</span>
                      <button 
                        onClick={() => setShowBinarySecretKey(!showBinarySecretKey)}
                        className="text-primary-600 hover:text-primary-800 underline text-xs"
                      >
                        {showBinarySecretKey ? "Hide Lattice" : "Show Lattice"}
                      </button>
                    </div>
                    {showBinarySecretKey && (
                      <BinaryVisualizer data={keyPair.secretKey} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Encapsulation */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">3. Encapsulation (Sender)</h2>
              <p className="text-secondary-700 mb-4">
                Encapsulate a shared secret using the recipient&apos;s public key. In a real-world scenario, this would be done by the sender.
              </p>
              <button
                onClick={encapsulate}
                disabled={!keyPair}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  keyPair
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                }`}
              >
                Encapsulate Shared Secret
              </button>

              {cipherText && sharedSecret && (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                      <span>Cipher Text (sent to recipient):</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setExpandedCipherText(!expandedCipherText)} 
                          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                        >
                          {expandedCipherText ? "Collapse" : "Expand"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(bytesToHex(cipherText), "Cipher Text")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedCipherText 
                          ? bytesToHex(cipherText)
                          : bytesToHex(cipherText).substring(0, 64) + "..."}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{cipherText.length} bytes</span>
                      <button 
                        onClick={() => setShowBinaryCipherText(!showBinaryCipherText)}
                        className="text-primary-600 hover:text-primary-800 underline text-xs"
                      >
                        {showBinaryCipherText ? "Hide Lattice" : "Show Lattice"}
                      </button>
                    </div>
                    {showBinaryCipherText && (
                      <BinaryVisualizer data={cipherText} />
                    )}
                  </div>

                  <div>
                    <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                      <span>Shared Secret (kept by sender):</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setExpandedSharedSecret(!expandedSharedSecret)} 
                          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                        >
                          {expandedSharedSecret ? "Collapse" : "Expand"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(bytesToHex(sharedSecret), "Shared Secret")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedSharedSecret 
                          ? bytesToHex(sharedSecret)
                          : bytesToHex(sharedSecret).substring(0, 64) + "..."}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{sharedSecret.length} bytes</span>
                      <button 
                        onClick={() => setShowBinarySharedSecret(!showBinarySharedSecret)}
                        className="text-primary-600 hover:text-primary-800 underline text-xs"
                      >
                        {showBinarySharedSecret ? "Hide Lattice" : "Show Lattice"}
                      </button>
                    </div>
                    {showBinarySharedSecret && (
                      <BinaryVisualizer data={sharedSecret} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Decapsulation */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">4. Decapsulation (Recipient)</h2>
              <p className="text-secondary-700 mb-4">
                Decapsulate the shared secret using the cipher text and recipient&apos;s secret key.
              </p>
              <button
                onClick={decapsulate}
                disabled={!keyPair || !cipherText}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  keyPair && cipherText
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                }`}
              >
                Decapsulate Shared Secret
              </button>

              {decapsulatedSecret && (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                      <span>Decapsulated Secret:</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setExpandedDecapsulatedSecret(!expandedDecapsulatedSecret)} 
                          className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                        >
                          {expandedDecapsulatedSecret ? "Collapse" : "Expand"}
                        </button>
                        <button 
                          onClick={() => copyToClipboard(bytesToHex(decapsulatedSecret), "Decapsulated Secret")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedDecapsulatedSecret 
                          ? bytesToHex(decapsulatedSecret)
                          : bytesToHex(decapsulatedSecret).substring(0, 64) + "..."}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{decapsulatedSecret.length} bytes</span>
                      <button 
                        onClick={() => setShowBinaryDecapsulatedSecret(!showBinaryDecapsulatedSecret)}
                        className="text-primary-600 hover:text-primary-800 underline text-xs"
                      >
                        {showBinaryDecapsulatedSecret ? "Hide Lattice" : "Show Lattice"}
                      </button>
                    </div>
                    {showBinaryDecapsulatedSecret && (
                      <BinaryVisualizer data={decapsulatedSecret} />
                    )}
                  </div>

                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    sharedSecret && decapsulatedSecret && areUint8ArraysEqual(sharedSecret, decapsulatedSecret)
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {sharedSecret && decapsulatedSecret && areUint8ArraysEqual(sharedSecret, decapsulatedSecret)
                      ? '✓ Success! Both parties now have the same shared secret.'
                      : '✗ Error: The decapsulated secret does not match the original secret.'}
                  </div>
                </div>
              )}
            </div>

            {/* AES Encryption */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">5. AES Encryption with Shared Secret</h2>
              <p className="text-secondary-700 mb-4">
                Use the shared secret to encrypt a message with AES-GCM.
              </p>

              {!sharedSecret ? (
                <div className="text-secondary-600 italic mb-4">
                  Complete steps 1-3 to generate a shared secret first.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-secondary-800 mb-2">Message to Encrypt:</label>
                    <textarea
                      value={plaintext}
                      onChange={(e) => setPlaintext(e.target.value)}
                      placeholder="Enter a message to encrypt..."
                      className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  
                  <button
                    onClick={encryptWithAES}
                    disabled={!plaintext}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      plaintext
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                    }`}
                  >
                    Encrypt Message
                  </button>

                  {encryptedMessage && (
                    <div>
                      <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                        <span>Encrypted Message:</span>
                        <button 
                          onClick={() => copyToClipboard(encryptedMessage, "Encrypted Message")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto break-all">
                        <code className="text-xs text-secondary-700">
                          {encryptedMessage.length > 128 
                            ? encryptedMessage.substring(0, 128) + "..."
                            : encryptedMessage}
                        </code>
                      </div>
                      <div className="text-xs text-secondary-600 mt-1">
                        This encrypted message can be sent over an insecure channel.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AES Decryption */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">6. AES Decryption with Shared Secret</h2>
              <p className="text-secondary-700 mb-4">
                Decrypt a message using the shared secret and AES-GCM.
              </p>

              {!decapsulatedSecret ? (
                <div className="text-secondary-600 italic mb-4">
                  Complete steps 1-4 to generate and decapsulate a shared secret first.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-secondary-800 mb-2">Encrypted Message:</label>
                    <textarea
                      value={decryptInput}
                      onChange={(e) => setDecryptInput(e.target.value)}
                      placeholder="Paste the encrypted message here..."
                      className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  
                  <button
                    onClick={decryptWithAES}
                    disabled={!decryptInput}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      decryptInput
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                    }`}
                  >
                    Decrypt Message
                  </button>

                  {decryptedText && (
                    <div>
                      <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                        <span>Decrypted Message:</span>
                        <button 
                          onClick={() => copyToClipboard(decryptedText, "Decrypted Message")}
                          className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg">
                        {decryptedText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Operation Log - RIGHT side */}
          <div className="md:w-1/3">
            <div className="bg-secondary-900 p-6 rounded-xl shadow-md sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">Operation Log</h2>
              <div className="bg-secondary-800 p-3 rounded-lg font-mono text-sm h-[600px] overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400">&gt; {log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 