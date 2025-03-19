'use client';

import React, { useState, useEffect } from 'react';
import { ml_dsa } from 'pqc';
import Link from 'next/link';
import LatticeVisualizer from '../../components/LatticeVisualizer';

export default function TryMLDSAPage() {
  const [algorithm, setAlgorithm] = useState<'ml_dsa44' | 'ml_dsa65' | 'ml_dsa87'>('ml_dsa44');
  const [keyPair, setKeyPair] = useState<{publicKey: Uint8Array, secretKey: Uint8Array} | null>(null);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<Uint8Array | null>(null);
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // File handling states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSignature, setFileSignature] = useState<Uint8Array | null>(null);
  const [fileVerifyResult, setFileVerifyResult] = useState<boolean | null>(null);
  
  // External signature verification states
  const [externalFile, setExternalFile] = useState<File | null>(null);
  const [externalPublicKey, setExternalPublicKey] = useState('');
  const [externalSignature, setExternalSignature] = useState('');
  const [externalAlgorithm, setExternalAlgorithm] = useState<'ml_dsa44' | 'ml_dsa65' | 'ml_dsa87'>('ml_dsa44');
  const [externalVerificationResult, setExternalVerificationResult] = useState('');
  const [externalVerificationSuccess, setExternalVerificationSuccess] = useState(false);
  
  // Expanded states
  const [expandedPublicKey, setExpandedPublicKey] = useState(false);
  const [expandedSecretKey, setExpandedSecretKey] = useState(false);
  const [expandedSignature, setExpandedSignature] = useState(false);
  const [expandedFileSignature, setExpandedFileSignature] = useState(false);

  // Matrix visualization states
  const [showMatrixPublicKey, setShowMatrixPublicKey] = useState(false);
  const [showMatrixSecretKey, setShowMatrixSecretKey] = useState(false);
  const [showMatrixSignature, setShowMatrixSignature] = useState(false);
  const [showMatrixFileSignature, setShowMatrixFileSignature] = useState(false);

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
    setShowMatrixPublicKey(false);
    setShowMatrixSecretKey(false);
    setShowMatrixSignature(false);
    setShowMatrixFileSignature(false);
    setLogs([`Algorithm changed to ${algorithm}`]);
  }, [algorithm]);

  // Copy function to copy array format
  const copyTextToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        log(`Copied ${label} to clipboard`);
      },
      () => {
        log(`Failed to copy ${label} to clipboard`);
      }
    );
  };

  // Generate new key pair
  const generateKeyPair = () => {
    try {
      const selectedAlgorithm = ml_dsa[algorithm];
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
      const selectedAlgorithm = ml_dsa[algorithm];
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
      const selectedAlgorithm = ml_dsa[algorithm];
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
      const selectedAlgorithm = ml_dsa[algorithm];
      
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
      const selectedAlgorithm = ml_dsa[algorithm];
      
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
  
  // Convert hex string back to Uint8Array
  const hexToBytes = (hex: string): Uint8Array => {
    // Check if it's in array format [1, 2, 3]
    if (hex.trim().startsWith('[') && hex.trim().endsWith(']')) {
      try {
        // Parse the array format
        const numberArray = JSON.parse(hex);
        if (Array.isArray(numberArray) && numberArray.every(n => typeof n === 'number')) {
          return new Uint8Array(numberArray);
        }
      } catch (e) {
        // If parsing fails, continue with hex parsing
        console.error("Failed to parse input as array:", e);
      }
    }

    // Remove any non-hex characters (spaces, line breaks, etc.)
    const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
    const hexChars = cleanHex.match(/.{1,2}/g) || [];
    return new Uint8Array(hexChars.map(byte => parseInt(byte, 16)));
  };

  // Handle external file selection
  const handleExternalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExternalFile(e.target.files[0]);
      log(`External file selected: ${e.target.files[0].name} (${e.target.files[0].size} bytes)`);
    }
  };
  
  // Verify external signature
  const verifyExternalSignature = async () => {
    if (!externalFile || !externalPublicKey || !externalSignature) {
      log('Need file, public key, and signature to verify');
      setExternalVerificationResult("Please provide all required values.");
      setExternalVerificationSuccess(false);
      return;
    }
    
    try {
      // Function to parse the input value (either array or hex)
      const parseInputValue = (value: string): Uint8Array => {
        // Try to parse as array format [1, 2, 3, ...]
        if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
          try {
            const arrayData = JSON.parse(value);
            if (Array.isArray(arrayData)) {
              return new Uint8Array(arrayData);
            }
          } catch (err) {
            console.error("Failed to parse input as array:", err);
          }
        }
        
        // Fallback to hex format
        return hexToBytes(value.replace(/\s+/g, ''));
      };
      
      const selectedAlgorithm = ml_dsa[externalAlgorithm];
      
      // Read file as array buffer
      const fileBuffer = await externalFile.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      
      // Convert inputs to bytes
      const publicKeyBytes = parseInputValue(externalPublicKey);
      const signatureBytes = parseInputValue(externalSignature);
      
      // Verify the signature
      const isValid = selectedAlgorithm.verify(publicKeyBytes, fileBytes, signatureBytes);
      
      setExternalVerificationResult(
        isValid ? "Verification Successful ✓ The file is authentic and hasn't been tampered with." 
        : "Verification Failed ✗ The file may have been tampered with or the wrong key was used."
      );
      setExternalVerificationSuccess(isValid);
      log(`External signature verification result: ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error: unknown) {
      console.error("Verification error:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid input format";
      setExternalVerificationResult(`Error: ${errorMessage}`);
      setExternalVerificationSuccess(false);
      log(`External verification error: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      <div className="bg-gradient-to-r from-accent-700 to-accent-900 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/ml-dsa" className="text-accent-100 hover:text-white flex items-center mb-6">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to ML-DSA
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">Interactive ML-DSA Signatures</h1>
          <p className="text-accent-100">
            Create and verify signatures using ML-DSA lattice-based signatures
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content - LEFT side */}
          <div className="md:w-2/3 space-y-8">
            {/* Algorithm Selector */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">1. Select Security Level</h2>
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'ml_dsa44' | 'ml_dsa65' | 'ml_dsa87')}
                className="w-full p-3 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="ml_dsa44">ML-DSA-44 (NIST Level 2, 128-bit security)</option>
                <option value="ml_dsa65">ML-DSA-65 (NIST Level 3, 192-bit security)</option>
                <option value="ml_dsa87">ML-DSA-87 (NIST Level 5, 256-bit security)</option>
              </select>
            </div>

            {/* Key Generation */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">2. ML-DSA Key Generation</h2>
              <button 
                onClick={generateKeyPair}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
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
                          onClick={() => copyTextToClipboard(`[${Array.from(keyPair.publicKey).join(', ')}]`, "Public Key")}
                          className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded hover:bg-accent-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedPublicKey 
                          ? `[${Array.from(keyPair.publicKey).join(', ')}]`
                          : `[${Array.from(keyPair.publicKey).slice(0, 20).join(', ')}${keyPair.publicKey.length > 20 ? ', ...' : ''}]`}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{keyPair.publicKey.length} bytes</span>
                      <button 
                        onClick={() => setShowMatrixPublicKey(!showMatrixPublicKey)}
                        className="text-accent-600 hover:text-accent-800 underline text-xs"
                      >
                        {showMatrixPublicKey ? "Lattice" : "Lattice"}
                      </button>
                    </div>
                    {showMatrixPublicKey && (
                      <LatticeVisualizer data={keyPair.publicKey} label="Public Key" />
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
                          onClick={() => copyTextToClipboard(`[${Array.from(keyPair.secretKey).join(', ')}]`, "Secret Key")}
                          className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded hover:bg-accent-200"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                      <code className="text-xs text-secondary-700 break-all">
                        {expandedSecretKey 
                          ? `[${Array.from(keyPair.secretKey).join(', ')}]`
                          : `[${Array.from(keyPair.secretKey).slice(0, 20).join(', ')}${keyPair.secretKey.length > 20 ? ', ...' : ''}]`}
                      </code>
                    </div>
                    <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                      <span>{keyPair.secretKey.length} bytes</span>
                      <button 
                        onClick={() => setShowMatrixSecretKey(!showMatrixSecretKey)}
                        className="text-accent-600 hover:text-accent-800 underline text-xs"
                      >
                        {showMatrixSecretKey ? "Lattice" : "Lattice"}
                      </button>
                    </div>
                    {showMatrixSecretKey && (
                      <LatticeVisualizer data={keyPair.secretKey} label="Secret Key" />
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
                      className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={signMessage}
                      disabled={!message}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        message 
                          ? "bg-accent-600 text-white hover:bg-accent-700" 
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
                          ? "bg-secondary-700 text-white hover:bg-secondary-800" 
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
                            onClick={() => copyTextToClipboard(`[${Array.from(signature).join(', ')}]`, "Signature")}
                            className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded hover:bg-accent-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                        <code className="text-xs text-secondary-700 break-all">
                          {expandedSignature 
                            ? `[${Array.from(signature).join(', ')}]`
                            : `[${Array.from(signature).slice(0, 20).join(', ')}${signature.length > 20 ? ', ...' : ''}]`}
                        </code>
                      </div>
                      <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                        <span>{signature.length} bytes</span>
                        <button 
                          onClick={() => setShowMatrixSignature(!showMatrixSignature)}
                          className="text-accent-600 hover:text-accent-800 underline text-xs"
                        >
                          {showMatrixSignature ? "Lattice" : "Lattice"}
                        </button>
                      </div>
                      {showMatrixSignature && (
                        <LatticeVisualizer data={signature} label="Signature" />
                      )}
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
                      className="block w-full text-secondary-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
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
                          ? "bg-accent-600 text-white hover:bg-accent-700" 
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
                          ? "bg-secondary-700 text-white hover:bg-secondary-800" 
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
                            onClick={() => copyTextToClipboard(`[${Array.from(fileSignature).join(', ')}]`, "File Signature")}
                            className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded hover:bg-accent-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="bg-secondary-50 p-3 rounded-lg overflow-x-auto">
                        <code className="text-xs text-secondary-700 break-all">
                          {expandedFileSignature 
                            ? `[${Array.from(fileSignature).join(', ')}]`
                            : `[${Array.from(fileSignature).slice(0, 20).join(', ')}${fileSignature.length > 20 ? ', ...' : ''}]`}
                        </code>
                      </div>
                      <div className="text-xs text-secondary-600 mt-1 flex justify-between">
                        <span>{fileSignature.length} bytes</span>
                        <button 
                          onClick={() => setShowMatrixFileSignature(!showMatrixFileSignature)}
                          className="text-accent-600 hover:text-accent-800 underline text-xs"
                        >
                          {showMatrixFileSignature ? "Lattice" : "Lattice"}
                        </button>
                      </div>
                      {showMatrixFileSignature && (
                        <LatticeVisualizer data={fileSignature} label="File Signature" />
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
                    onChange={(e) => setExternalAlgorithm(e.target.value as 'ml_dsa44' | 'ml_dsa65' | 'ml_dsa87')}
                    className="w-full p-3 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="ml_dsa44">ML-DSA-44 (NIST Level 2, 128-bit security)</option>
                    <option value="ml_dsa65">ML-DSA-65 (NIST Level 3, 192-bit security)</option>
                    <option value="ml_dsa87">ML-DSA-87 (NIST Level 5, 256-bit security)</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Select File to Verify:</label>
                  <input
                    type="file"
                    onChange={handleExternalFileChange}
                    className="block w-full text-secondary-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
                  />
                </div>
                {externalFile && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <div className="font-medium text-secondary-800">Selected File:</div>
                    <div className="text-secondary-700">{externalFile.name} ({Math.round(externalFile.size / 1024)} KB)</div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Public Key (hex or array format):</label>
                  <textarea
                    value={externalPublicKey}
                    onChange={(e) => setExternalPublicKey(e.target.value)}
                    placeholder="Paste the public key in hex format or as array like [1, 2, 3, ...]"
                    className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono text-sm"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block font-medium text-secondary-800">Signature (hex or array format):</label>
                  <textarea
                    value={externalSignature}
                    onChange={(e) => setExternalSignature(e.target.value)}
                    placeholder="Paste the signature in hex format or as array like [1, 2, 3, ...]"
                    className="w-full p-3 border border-secondary-200 rounded-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono text-sm"
                    rows={3}
                  />
                </div>
                
                <div className="mt-2 p-3 bg-secondary-50 rounded-lg text-xs text-secondary-600">
                  <p className="font-medium">Supported Formats:</p>
                  <p>- Array format: [1, 2, 3, 4, ...] (copied from the interactive tool)</p>
                  <p>- Hex format: a1b2c3d4... (traditional format without spaces)</p>
                </div>
                
                <button 
                  onClick={verifyExternalSignature}
                  disabled={!externalFile || !externalPublicKey || !externalSignature}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    externalFile && externalPublicKey && externalSignature
                      ? "bg-accent-600 text-white hover:bg-accent-700" 
                      : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
                  }`}
                >
                  Verify External Signature
                </button>
              </div>

              {externalVerificationResult && (
                <div className={`mt-4 p-3 rounded-lg ${
                  externalVerificationSuccess 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {externalVerificationResult}
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