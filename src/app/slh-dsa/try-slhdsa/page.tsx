'use client';

import React, { useState, useEffect } from 'react';
import { slh_dsa } from 'pqc';
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
          className={`h-3 w-full ${bit ? 'bg-secondary-600' : 'bg-secondary-200'}`}
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

export default function TrySLHDSAPage() {
  const [algorithm, setAlgorithm] = useState<string>('slh_dsa_sha2_128s');
  const [keyPair, setKeyPair] = useState<{publicKey: Uint8Array, secretKey: Uint8Array} | null>(null);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<Uint8Array | null>(null);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // File handling states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSignature, setFileSignature] = useState<Uint8Array | null>(null);
  const [fileVerifyResult, setFileVerifyResult] = useState<boolean | null>(null);
  
  // Expanded states
  const [expandedPublicKey, setExpandedPublicKey] = useState(false);
  const [expandedSecretKey, setExpandedSecretKey] = useState(false);
  const [expandedSignature, setExpandedSignature] = useState(false);
  const [expandedFileSignature, setExpandedFileSignature] = useState(false);
  
  // Binary visualization states
  const [showBinaryPublicKey, setShowBinaryPublicKey] = useState(false);
  const [showBinarySecretKey, setShowBinarySecretKey] = useState(false);
  const [showBinarySignature, setShowBinarySignature] = useState(false);
  const [showBinaryFileSignature, setShowBinaryFileSignature] = useState(false);
  
  // External signature verification states
  const [externalFile, setExternalFile] = useState<File | null>(null);
  const [externalPublicKey, setExternalPublicKey] = useState('');
  const [externalSignature, setExternalSignature] = useState('');
  const [externalAlgorithm, setExternalAlgorithm] = useState<string>('slh_dsa_sha2_128s');
  const [externalVerifyResult, setExternalVerifyResult] = useState<boolean | null>(null);
  
  // Available algorithms
  const algorithms = [
    { value: 'slh_dsa_sha2_128s', label: 'SLH-DSA-SHA2-128s (128-bit security)' },
    { value: 'slh_dsa_sha2_128f', label: 'SLH-DSA-SHA2-128f (128-bit security, fast)' },
    { value: 'slh_dsa_sha2_192s', label: 'SLH-DSA-SHA2-192s (192-bit security)' },
    { value: 'slh_dsa_sha2_192f', label: 'SLH-DSA-SHA2-192f (192-bit security, fast)' },
    { value: 'slh_dsa_sha2_256s', label: 'SLH-DSA-SHA2-256s (256-bit security)' },
    { value: 'slh_dsa_sha2_256f', label: 'SLH-DSA-SHA2-256f (256-bit security, fast)' },
    { value: 'slh_dsa_shake_128s', label: 'SLH-DSA-SHAKE-128s (128-bit security)' },
    { value: 'slh_dsa_shake_128f', label: 'SLH-DSA-SHAKE-128f (128-bit security, fast)' },
    { value: 'slh_dsa_shake_192s', label: 'SLH-DSA-SHAKE-192s (192-bit security)' },
    { value: 'slh_dsa_shake_192f', label: 'SLH-DSA-SHAKE-192f (192-bit security, fast)' },
    { value: 'slh_dsa_shake_256s', label: 'SLH-DSA-SHAKE-256s (256-bit security)' },
    { value: 'slh_dsa_shake_256f', label: 'SLH-DSA-SHAKE-256f (256-bit security, fast)' },
  ];
  
  // Log function to track operations
  const log = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  // Reset all state when algorithm changes
  useEffect(() => {
    setKeyPair(null);
    setMessage('');
    setSignature(null);
    setVerifyResult(null);
    setSelectedFile(null);
    setFileSignature(null);
    setFileVerifyResult(null);
    setExpandedPublicKey(false);
    setExpandedSecretKey(false);
    setExpandedSignature(false);
    setExpandedFileSignature(false);
    setShowBinaryPublicKey(false);
    setShowBinarySecretKey(false);
    setShowBinarySignature(false);
    setShowBinaryFileSignature(false);
    setExternalFile(null);
    setExternalPublicKey('');
    setExternalSignature('');
    setExternalVerifyResult(null);
    setExternalAlgorithm('slh_dsa_sha2_128s');
    setLogs([`Algorithm changed to ${algorithm}`]);
  }, [algorithm]);

  // Generate new key pair
  const generateKeyPair = () => {
    try {
      const selectedAlgorithm = slh_dsa[algorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${algorithm} not found in the pqc module`);
        return;
      }
      
      const keys = selectedAlgorithm.keygen();
      setKeyPair(keys);
      log(`Generated ${algorithm} key pair`);
      log(`Public key length: ${keys.publicKey.length} bytes`);
      log(`Secret key length: ${keys.secretKey.length} bytes`);
    } catch (error) {
      log(`Error generating keys: ${error}`);
    }
  };

  // Sign a message
  const signMessage = async () => {
    if (!keyPair || !message) {
      log('Need key pair and message to sign');
      return;
    }
    
    try {
      const selectedAlgorithm = slh_dsa[algorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${algorithm} not found in the pqc module`);
        return;
      }
      
      const messageBytes = new TextEncoder().encode(message);
      
      // Call the sign function with the correct parameter order
      const signature = selectedAlgorithm.sign(keyPair.secretKey, messageBytes);
      
      setSignature(signature);
      setVerifyResult(null);
      log(`Message signed successfully`);
      log(`Signature length: ${signature.length} bytes`);
    } catch (error) {
      log(`Signing error: ${error}`);
    }
  };
  
  // Verify a message signature
  const verifyMessage = async () => {
    if (!keyPair || !message || !signature) {
      log('Need key pair, message, and signature to verify');
      return;
    }
    
    try {
      const selectedAlgorithm = slh_dsa[algorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${algorithm} not found in the pqc module`);
        return;
      }
      
      const messageBytes = new TextEncoder().encode(message);
      
      // Call the verify function with the correct parameter order
      const isValid = selectedAlgorithm.verify(keyPair.publicKey, messageBytes, signature);
      
      setVerifyResult(isValid);
      log(`Signature verification result: ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      log(`Verification error: ${error}`);
      setVerifyResult(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileSignature(null);
      setFileVerifyResult(null);
      log(`File selected: ${e.target.files[0].name} (${e.target.files[0].size} bytes)`);
    }
  };
  
  // Sign a file
  const signFile = async () => {
    if (!keyPair || !selectedFile) {
      log('Need key pair and file to sign');
      return;
    }
    
    try {
      const selectedAlgorithm = slh_dsa[algorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${algorithm} not found in the pqc module`);
        return;
      }
      
      // Read file as array buffer
      const fileBuffer = await selectedFile.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      
      // Sign the file
      const signature = selectedAlgorithm.sign(keyPair.secretKey, fileBytes);
      
      setFileSignature(signature);
      setFileVerifyResult(null);
      log(`File signed successfully`);
      log(`File signature length: ${signature.length} bytes`);
    } catch (error) {
      log(`File signing error: ${error}`);
    }
  };
  
  // Verify a file signature
  const verifyFile = async () => {
    if (!keyPair || !selectedFile || !fileSignature) {
      log('Need key pair, file, and signature to verify');
      return;
    }
    
    try {
      const selectedAlgorithm = slh_dsa[algorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${algorithm} not found in the pqc module`);
        return;
      }
      
      // Read file as array buffer
      const fileBuffer = await selectedFile.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      
      // Verify the file signature
      const isValid = selectedAlgorithm.verify(keyPair.publicKey, fileBytes, fileSignature);
      
      setFileVerifyResult(isValid);
      log(`File signature verification result: ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      log(`File verification error: ${error}`);
      setFileVerifyResult(false);
    }
  };
  
  // Handle external file selection
  const handleExternalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExternalFile(e.target.files[0]);
      setExternalVerifyResult(null);
      log(`External file selected: ${e.target.files[0].name} (${e.target.files[0].size} bytes)`);
    }
  };

  // Verify external signature
  const verifyExternalSignature = async () => {
    if (!externalFile || !externalPublicKey || !externalSignature) {
      log('Need file, public key, and signature to verify');
      return;
    }
    
    try {
      const selectedAlgorithm = slh_dsa[externalAlgorithm as keyof typeof slh_dsa];
      if (!selectedAlgorithm) {
        log(`Algorithm ${externalAlgorithm} not found in the pqc module`);
        return;
      }
      
      // Read file as array buffer
      const fileBuffer = await externalFile.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      
      // Convert hex strings to bytes
      const publicKeyBytes = hexToBytes(externalPublicKey);
      const signatureBytes = hexToBytes(externalSignature);
      
      // Verify the signature
      const isValid = selectedAlgorithm.verify(publicKeyBytes, fileBytes, signatureBytes);
      
      setExternalVerifyResult(isValid);
      log(`External signature verification result: ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      log(`External verification error: ${error}`);
      setExternalVerifyResult(false);
    }
  };

  // Convert hex string back to Uint8Array
  const hexToBytes = (hex: string): Uint8Array => {
    // Remove any non-hex characters (spaces, line breaks, etc.)
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    const hexChars = cleanHex.match(/.{1,2}/g) || [];
    return new Uint8Array(hexChars.map(byte => parseInt(byte, 16)));
  };
  
  // Convert Uint8Array to hex string for display
  const bytesToHex = (bytes: Uint8Array | null): string => {
    if (!bytes) return '';
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-900 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/slh-dsa" className="text-secondary-100 hover:text-white flex items-center mb-6">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to SLH-DSA
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">Interactive SLH-DSA Signatures</h1>
          <p className="text-secondary-100">
            Create and verify signatures using SLH-DSA hash-based signatures
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content - LEFT side */}
          <div className="md:w-2/3 space-y-8">
            {/* Algorithm Selector */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">1. Select Algorithm Variant</h2>
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full p-3 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                {algorithms.map(alg => (
                  <option key={alg.value} value={alg.value}>{alg.label}</option>
                ))}
              </select>
              <div className="mt-3 text-sm text-secondary-600">
                <p><strong>s</strong> variants have smaller signatures but slower signing.</p>
                <p><strong>f</strong> variants have faster signing but larger signatures.</p>
                <p><strong>SHAKE</strong> variants use SHAKE-based hash while <strong>SHA2</strong> variants use SHA-2 hash.</p>
              </div>
            </div>

            {/* Key Generation */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">2. SLH-DSA Key Generation</h2>
              <button 
                onClick={generateKeyPair}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
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
                        className="text-secondary-600 hover:text-secondary-800 underline text-xs"
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
                        className="text-secondary-600 hover:text-secondary-800 underline text-xs"
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
            
            {/* Message Signing */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">3. Sign & Verify Messages</h2>
              
              {!keyPair ? (
                <div className="text-secondary-600 italic mb-4">
                  Generate a key pair first to sign and verify messages.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block font-medium text-secondary-800">Message to Sign:</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter a message to sign..."
                      className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={signMessage}
                      disabled={!message}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        message 
                          ? "bg-secondary-600 text-white hover:bg-secondary-700" 
                          : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                      }`}
                    >
                      Sign Message
                    </button>
                    
                    <button 
                      onClick={verifyMessage}
                      disabled={!signature}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        signature 
                          ? "bg-primary-600 text-white hover:bg-primary-700" 
                          : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                      }`}
                    >
                      Verify Signature
                    </button>
                  </div>
                  
                  {signature && (
                    <div>
                      <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                        <span>Signature:</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setExpandedSignature(!expandedSignature)} 
                            className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                          >
                            {expandedSignature ? "Collapse" : "Expand"}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(bytesToHex(signature), "Signature")}
                            className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                        <code className="text-xs text-secondary-700 break-all">
                          {expandedSignature 
                            ? bytesToHex(signature)
                            : bytesToHex(signature).substring(0, 64) + "..."}
                        </code>
                      </div>
                      <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                        <span>{signature.length} bytes</span>
                        <button 
                          onClick={() => setShowBinarySignature(!showBinarySignature)}
                          className="text-secondary-600 hover:text-secondary-800 underline text-xs"
                        >
                          {showBinarySignature ? "Hide Lattice" : "Show Lattice"}
                        </button>
                      </div>
                      {showBinarySignature && (
                        <BinaryVisualizer data={signature} />
                      )}
                      
                      <div className="mt-2 p-3 bg-secondary-50 rounded-lg text-xs text-secondary-700">
                        <p className="font-medium mb-1">About SLH-DSA Signatures:</p>
                        <p>SLH-DSA signatures are based on hash-based cryptography. Unlike ML-DSA, they&apos;re not directly affected by 
                        quantum computers, as they rely solely on the security of cryptographic hash functions.</p>
                        <p className="mt-1">Notice the larger signature size compared to ML-DSA. This is a common trade-off with 
                        hash-based signature schemes.</p>
                      </div>
                    </div>
                  )}
                  
                  {verifyResult !== null && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      verifyResult 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {verifyResult 
                        ? '✓ Signature is valid! The message is authentic and hasn\'t been tampered with.' 
                        : '✗ Signature verification failed! The message may have been tampered with or the wrong key was used.'}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* File Signing */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">4. Sign & Verify Files</h2>
              
              {!keyPair ? (
                <div className="text-secondary-600 italic mb-4">
                  Generate a key pair first to sign and verify files.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block font-medium text-secondary-800">Select a file to sign:</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-secondary-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100"
                    />
                  </div>
                  
                  {selectedFile && (
                    <div className="bg-secondary-50 p-3 rounded-lg">
                      <div className="font-medium text-secondary-800">Selected File:</div>
                      <div className="text-secondary-700">{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={signFile}
                      disabled={!selectedFile}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedFile 
                          ? "bg-secondary-600 text-white hover:bg-secondary-700" 
                          : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                      }`}
                    >
                      Sign File
                    </button>
                    
                    <button 
                      onClick={verifyFile}
                      disabled={!fileSignature}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        fileSignature 
                          ? "bg-primary-600 text-white hover:bg-primary-700" 
                          : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                      }`}
                    >
                      Verify File Signature
                    </button>
                  </div>
                  
                  {fileSignature && (
                    <div>
                      <div className="font-medium text-secondary-800 mb-1 flex justify-between items-center">
                        <span>File Signature:</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setExpandedFileSignature(!expandedFileSignature)} 
                            className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded hover:bg-secondary-200"
                          >
                            {expandedFileSignature ? "Collapse" : "Expand"}
                          </button>
                          <button 
                            onClick={() => copyToClipboard(bytesToHex(fileSignature), "File Signature")}
                            className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                        <code className="text-xs text-secondary-700 break-all">
                          {expandedFileSignature 
                            ? bytesToHex(fileSignature)
                            : bytesToHex(fileSignature).substring(0, 64) + "..."}
                        </code>
                      </div>
                      <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                        <span>{fileSignature.length} bytes</span>
                        <button 
                          onClick={() => setShowBinaryFileSignature(!showBinaryFileSignature)}
                          className="text-secondary-600 hover:text-secondary-800 underline text-xs"
                        >
                          {showBinaryFileSignature ? "Hide Lattice" : "Show Lattice"}
                        </button>
                      </div>
                      {showBinaryFileSignature && (
                        <BinaryVisualizer data={fileSignature} />
                      )}
                      
                      <button 
                        onClick={() => {
                          const blob = new Blob([fileSignature], { type: 'application/octet-stream' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedFile?.name || 'file'}.sig`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          log(`Signature downloaded as ${selectedFile?.name || 'file'}.sig`);
                        }}
                        className="mt-3 px-3 py-1 text-sm bg-accent-100 text-accent-800 rounded-md hover:bg-accent-200 transition-colors inline-flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Signature
                      </button>
                    </div>
                  )}
                  
                  {fileVerifyResult !== null && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      fileVerifyResult 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {fileVerifyResult 
                        ? '✓ File signature is valid! The file is authentic and hasn\'t been tampered with.' 
                        : '✗ File signature verification failed! The file may have been tampered with or the wrong key was used.'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* External Signature Verification */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">5. Verify External Signature</h2>
              <p className="text-secondary-700 mb-4">
                Verify a signature that was created externally. Upload a file, paste the public key and signature in hex format, and select the algorithm used.
              </p>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Select Algorithm:</label>
                  <select 
                    value={externalAlgorithm}
                    onChange={(e) => setExternalAlgorithm(e.target.value)}
                    className="w-full p-3 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500"
                  >
                    {algorithms.map(alg => (
                      <option key={alg.value} value={alg.value}>{alg.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Select File to Verify:</label>
                  <input
                    type="file"
                    onChange={handleExternalFileChange}
                    className="block w-full text-secondary-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Public Key (hex format):</label>
                  <textarea
                    value={externalPublicKey}
                    onChange={(e) => setExternalPublicKey(e.target.value)}
                    placeholder="Paste the public key in hex format..."
                    className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500 font-mono text-sm"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Signature (hex format):</label>
                  <textarea
                    value={externalSignature}
                    onChange={(e) => setExternalSignature(e.target.value)}
                    placeholder="Paste the signature in hex format..."
                    className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-secondary-500 font-mono text-sm"
                    rows={3}
                  />
                </div>
                
                <button 
                  onClick={verifyExternalSignature}
                  disabled={!externalFile || !externalPublicKey || !externalSignature}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    externalFile && externalPublicKey && externalSignature
                      ? "bg-secondary-600 text-white hover:bg-secondary-700" 
                      : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                  }`}
                >
                  Verify External Signature
                </button>
                
                {externalVerifyResult !== null && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    externalVerifyResult 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {externalVerifyResult 
                      ? '✓ External signature is valid! The file is authentic and hasn\'t been tampered with.' 
                      : '✗ External signature verification failed! Check that you\'ve selected the correct algorithm, and that the public key and signature are in the correct format.'}
                  </div>
                )}
              </div>
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