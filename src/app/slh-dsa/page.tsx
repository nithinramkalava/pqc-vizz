'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import CryptoVisualizer from '../components/CryptoVisualizer';
import { slh_dsa } from 'pqc';
import { utf8ToBytes } from 'pqc/utilities/utils';
import Link from 'next/link';

export default function SLHDSAPage() {
  const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const visualizationRef = useRef<HTMLDivElement>(null);

  // Reset animation when flow changes
  useEffect(() => {
    if (flow) {
      setAnimationStep(0);
      setAnimationComplete(false);
      // Start animation sequence
      const timer = setTimeout(() => {
        animateSequence();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flow]);

  // Auto-scroll to visualization when it becomes visible
  useEffect(() => {
    if (flow && visualizationRef.current) {
      visualizationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [flow]);

  // Animation sequence for the signature flow
  const animateSequence = () => {
    const totalSteps = 3; // Total animation steps
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setAnimationStep(currentStep);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setAnimationComplete(true);
      }
    }, 1200); // Advance animation every 1.2 seconds

    return () => clearInterval(interval);
  };

  const slhDsaLevels = [
    { label: 'SLH-DSA-SHA2-128f (Fast, 128-bit)', value: 'slh_dsa_sha2_128f' },
    { label: 'SLH-DSA-SHA2-128s (Small, 128-bit)', value: 'slh_dsa_sha2_128s' },
    { label: 'SLH-DSA-SHAKE-128f (Fast, 128-bit)', value: 'slh_dsa_shake_128f' },
    { label: 'SLH-DSA-SHAKE-128s (Small, 128-bit)', value: 'slh_dsa_shake_128s' },
    { label: 'SLH-DSA-SHA2-192f (Fast, 192-bit)', value: 'slh_dsa_sha2_192f' },
    { label: 'SLH-DSA-SHA2-192s (Small, 192-bit)', value: 'slh_dsa_sha2_192s' },
    { label: 'SLH-DSA-SHAKE-192f (Fast, 192-bit)', value: 'slh_dsa_shake_192f' },
    { label: 'SLH-DSA-SHAKE-192s (Small, 192-bit)', value: 'slh_dsa_shake_192s' },
    { label: 'SLH-DSA-SHA2-256f (Fast, 256-bit)', value: 'slh_dsa_sha2_256f' },
    { label: 'SLH-DSA-SHA2-256s (Small, 256-bit)', value: 'slh_dsa_sha2_256s' },
    { label: 'SLH-DSA-SHAKE-256f (Fast, 256-bit)', value: 'slh_dsa_shake_256f' },
    { label: 'SLH-DSA-SHAKE-256s (Small, 256-bit)', value: 'slh_dsa_shake_256s' }
  ];

  const operations = [
    'Key Generation',
    'Sign Message',
    'Verify Signature',
    'Complete DSA Flow'
  ];

  const executeSLHDSA = async (operation: string, securityLevel: string, inputMessage?: string) => {
    // SLH-DSA is much slower, especially at higher security levels
    setWarning("SLH-DSA operations can take several seconds to minutes to complete, especially for higher security levels. Please be patient.");
    
    try {
      // Get algorithm based on security level
      const algorithm = slh_dsa[securityLevel as keyof typeof slh_dsa];
      
      if (!algorithm) {
        throw new Error(`Algorithm ${securityLevel} not found`);
      }

      // Convert user message to bytes or use default message if none provided
      const defaultMessage = "This is a default test message for SLH-DSA signature.";
      const messageStr = inputMessage || defaultMessage;
      const message = utf8ToBytes(messageStr);

      // Process based on selected operation
      switch (operation) {
        case 'Key Generation': {
          const startTime = performance.now();
          const keyPair = algorithm.keygen();
          const endTime = performance.now();
          setWarning(null);
          return {
            publicKey: Array.from(keyPair.publicKey),
            secretKey: Array.from(keyPair.secretKey),
            publicKeySize: keyPair.publicKey.length,
            secretKeySize: keyPair.secretKey.length,
            executionTime: `${(endTime - startTime).toFixed(2)}ms`
          };
        }
        
        case 'Sign Message': {
          // Generate key pair and sign message
          const keyPair = algorithm.keygen();
          
          const startTime = performance.now();
          const signature = algorithm.sign(keyPair.secretKey, message);
          const endTime = performance.now();
          
          setWarning(null);
          return {
            message: messageStr,
            signature: Array.from(signature),
            signatureSize: signature.length,
            executionTime: `${(endTime - startTime).toFixed(2)}ms`
          };
        }
        
        case 'Verify Signature': {
          // Generate key pair, sign message, and verify
          const keyPair = algorithm.keygen();
          const signature = algorithm.sign(keyPair.secretKey, message);
          
          const startTime = performance.now();
          const isValid = algorithm.verify(keyPair.publicKey, message, signature);
          const endTime = performance.now();
          
          setWarning(null);
          return {
            message: messageStr,
            isValid: isValid,
            executionTime: `${(endTime - startTime).toFixed(2)}ms`
          };
        }
        
        case 'Complete DSA Flow': {
          // Full flow demonstration
          // 1. [Signer] generates a key pair
          const startKeyGen = performance.now();
          const signerKeys = algorithm.keygen();
          const endKeyGen = performance.now();
          
          // 2. [Signer] signs a message
          const startSign = performance.now();
          const signature = algorithm.sign(signerKeys.secretKey, message);
          const endSign = performance.now();
          
          // 3. [Verifier] verifies the signature
          const startVerify = performance.now();
          const isValid = algorithm.verify(signerKeys.publicKey, message, signature);
          const endVerify = performance.now();
          
          // Save flow for visualization
          setFlow({
            message: messageStr,
            signerPublicKey: Array.from(signerKeys.publicKey).slice(0, 10),
            signerPrivateKey: Array.from(signerKeys.secretKey).slice(0, 10),
            signature: Array.from(signature).slice(0, 10),
            isValid: isValid,
          });
          
          setWarning(null);
          return {
            keyGeneration: {
              publicKeySize: signerKeys.publicKey.length,
              secretKeySize: signerKeys.secretKey.length,
              executionTime: `${(endKeyGen - startKeyGen).toFixed(2)}ms`
            },
            signing: {
              signatureSize: signature.length,
              executionTime: `${(endSign - startSign).toFixed(2)}ms`
            },
            verification: {
              isValid: isValid,
              executionTime: `${(endVerify - startVerify).toFixed(2)}ms`
            },
            totalExecutionTime: `${(endVerify - startKeyGen).toFixed(2)}ms`
          };
        }
        
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      setWarning(null);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header colorScheme="secondary" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-700 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="mr-4 bg-white p-3 rounded-full">
                <svg className="h-8 w-8 text-secondary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">SLH-DSA: Stateless Hash-based Digital Signature Algorithm</h1>
            </div>
            <p className="text-xl text-secondary-100 mb-6">
              A quantum-resistant digital signature algorithm standardized in FIPS 205
            </p>
            <div className="bg-secondary-600/50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <div className="text-sm text-secondary-200">Security Basis</div>
                  <div className="font-medium">Cryptographic Hash Functions</div>
                </div>
                <div>
                  <div className="text-sm text-secondary-200">Primary Use</div>
                  <div className="font-medium">Digital Signatures</div>
                </div>
                <div>
                  <div className="text-sm text-secondary-200">Replaces</div>
                  <div className="font-medium">RSA & ECDSA Signatures</div>
                </div>
                <div>
                  <div className="text-sm text-secondary-200">Previously Known As</div>
                  <div className="font-medium">SPHINCS+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow bg-secondary-50">
        <div className="container mx-auto px-4 py-12">
          
          {/* Algorithm Explanation */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-1 p-8">
                  <h2 className="text-2xl font-bold mb-6 text-secondary-900">About SLH-DSA</h2>
                  <p className="text-secondary-800 mb-4">
                    SLH-DSA (previously known as SPHINCS+) is a hash-based digital signature algorithm standardized by NIST as 
                    FIPS 205. Unlike lattice-based algorithms, SLH-DSA&apos;s security is based on the properties of cryptographic 
                    hash functions, which are believed to be resistant to both classical and quantum attacks.
                  </p>
                  <p className="text-secondary-800 mb-4">
                    SLH-DSA offers multiple parameter sets with different tradeoffs between speed, signature size, and security level.
                    The &quot;f&quot; variants prioritize speed, while the &quot;s&quot; variants produce smaller signatures at the cost of performance.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> SLH-DSA operations are significantly slower than ML-KEM and ML-DSA, especially at 
                      higher security levels. This is a characteristic of hash-based signature schemes. In production environments, 
                      this would be optimized with native code implementations.
                    </p>
                  </div>
                </div>
                <div className="md:w-96 bg-secondary-50 p-8">
                  <h3 className="text-xl font-semibold mb-4 text-secondary-900">Security Levels</h3>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-secondary-100 rounded-lg text-secondary-700 font-bold">
                        128
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">SLH-DSA-128</h4>
                        <p className="text-sm text-secondary-700">128-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-secondary-200 rounded-lg text-secondary-800 font-bold">
                        192
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">SLH-DSA-192</h4>
                        <p className="text-sm text-secondary-700">192-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-secondary-300 rounded-lg text-secondary-900 font-bold">
                        256
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">SLH-DSA-256</h4>
                        <p className="text-sm text-secondary-700">256-bit security level</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-secondary-100">
                        <div className="text-center mb-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-100 text-secondary-700 text-xs font-bold mb-1">F</span>
                          <h4 className="font-medium text-secondary-900">Fast</h4>
                        </div>
                        <p className="text-xs text-secondary-700 text-center">Optimized for speed</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-secondary-100">
                        <div className="text-center mb-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-100 text-secondary-700 text-xs font-bold mb-1">S</span>
                          <h4 className="font-medium text-secondary-900">Small</h4>
                        </div>
                        <p className="text-xs text-secondary-700 text-center">Optimized for signature size</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-secondary-100">
                        <div className="text-center mb-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-100 text-secondary-700 text-xs font-bold mb-1">2</span>
                          <h4 className="font-medium text-secondary-900">SHA-2</h4>
                        </div>
                        <p className="text-xs text-secondary-700 text-center">Standard NIST hash function</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-secondary-100">
                        <div className="text-center mb-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary-100 text-secondary-700 text-xs font-bold mb-1">S</span>
                          <h4 className="font-medium text-secondary-900">SHAKE</h4>
                        </div>
                        <p className="text-xs text-secondary-700 text-center">SHA-3 derived function</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {warning && (
            <div className="mb-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
              <p className="text-yellow-800">{warning}</p>
            </div>
          )}
          
          {/* Signature Process Visualization */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">How SLH-DSA Works</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-secondary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900">1. Key Generation</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      The signer generates a key pair using a combination of cryptographic hash functions. This process creates
                      a public key that will be published and a secret key kept confidential.
                    </p>
                    <div className="mt-auto pt-4 border-t border-secondary-200">
                      <div className="text-sm text-secondary-800">
                        <span className="font-medium">Output:</span> Public Key, Secret Key
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-secondary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900">2. Signing</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Using their secret key, the signer creates a digital signature for a message through a complex combination of
                      WOTS+ one-time signatures, FORS trees, and hypertree structures.
                    </p>
                    <div className="mt-auto pt-4 border-t border-secondary-200">
                      <div className="text-sm text-secondary-800">
                        <span className="font-medium">Input:</span> Message, Secret Key<br/>
                        <span className="font-medium">Output:</span> Digital Signature
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-secondary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900">3. Verification</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Anyone can verify the signature&apos;s authenticity using the signer&apos;s public key and hash functions,
                      confirming the message hasn&apos;t been altered and was signed by the holder of the secret key.
                    </p>
                    <div className="mt-auto pt-4 border-t border-secondary-200">
                      <div className="text-sm text-secondary-800">
                        <span className="font-medium">Input:</span> Message, Signature, Public Key<br/>
                        <span className="font-medium">Output:</span> Valid or Invalid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-secondary-800 mb-6">
                  SLH-DSA uses a more complex approach than other signature schemes, but this provides the benefit of minimizing security assumptions
                  by relying only on the security of hash functions.
                </div>
                <button 
                  onClick={() => {
                    const testMessage = "This is a test message for SLH-DSA visualization";
                    executeSLHDSA('Complete DSA Flow', 'slh_dsa_shake_128f', testMessage);
                  }}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center"
                >
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Visualize Complete Flow
                </button>
              </div>
            </div>
          </section>
          
          {/* Interactive Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Try SLH-DSA Operations</h2>
            <CryptoVisualizer
              title="SLH-DSA Operations"
              description="Explore SLH-DSA's key generation, signing, and verification operations with different variants."
              operationTypes={operations}
              securityLevels={slhDsaLevels}
              onExecute={executeSLHDSA}
            />
          </section>
          
          {flow && (
            <section className="mb-12" ref={visualizationRef}>
              <h2 className="text-2xl font-bold mb-6 text-secondary-900">Signature Flow Visualization</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                  {/* Flow diagram */}
                  <div className="flex flex-col md:flex-row items-center justify-center w-full">
                    {/* Signer Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-gray-50 rounded-xl border border-gray-200 p-6 transition-all duration-500 
                        ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Signer</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-gray-100 transition-all duration-500 
                            ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-gray-800 mb-2">1. Generates Key Pair</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Public Key:</strong> {flow.signerPublicKey as React.ReactNode}</p>
                              <p><strong>Private Key:</strong> {flow.signerPrivateKey as React.ReactNode}</p>
                            </div>
                          </div>
                          
                          <div className={`bg-white rounded-lg p-4 border border-gray-100 transition-all duration-500 
                            ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-gray-800 mb-2">2. Signs Message</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Message:</strong> {flow.message as React.ReactNode}</p>
                              <p><strong>Signature:</strong> {flow.signature as React.ReactNode}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle Arrows */}
                    <div className="w-full md:w-2/12 py-4 flex flex-col items-center justify-center">
                      <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                        ${animationStep >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                      <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                      
                      <div className={`bg-white rounded-full p-3 shadow-md transition-all duration-700 
                        ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      
                      <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                        ${animationStep >= 3 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                      <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                    </div>
                    
                    {/* Verifier Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-gray-50 rounded-xl border border-gray-200 p-6 transition-all duration-500 
                        ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">Verifier</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-gray-100 transition-all duration-500 
                            ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-gray-800 mb-2">3. Verifies Signature</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Message:</strong> {flow.message as React.ReactNode}</p>
                              <p><strong>Public Key:</strong> {flow.signerPublicKey as React.ReactNode}</p>
                              <p><strong>Signature:</strong> {flow.signature as React.ReactNode}</p>
                              <p><strong>Result:</strong> <span className={flow.isValid ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                {flow.isValid ? "Valid ✓" : "Invalid ✗"}
                              </span></p>
                              
                              {animationComplete && (flow.isValid as boolean) && (
                                <div className="mt-3 text-xs text-green-600 flex items-center">
                                  <svg className="h-4 w-4 mr-1 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Signature verification successful!
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-700 
                  ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-blue-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-800 mb-1">Security Note:</p>
                      <p className="text-sm text-blue-700">
                        SLH-DSA has minimal security assumptions, relying only on the security of the underlying hash functions.
                        This makes it a conservative choice for scenarios requiring long-term security against quantum attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* Technical Details */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">SLH-DSA Technical Details</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-secondary-900">Components</h3>
                  <ul className="space-y-4">
                    <li className="bg-secondary-50 p-4 rounded-lg">
                      <h4 className="font-medium text-secondary-900 mb-1">WOTS+ (Winternitz One-Time Signature)</h4>
                      <p className="text-sm text-secondary-700">A one-time signature scheme that forms the building block for SLH-DSA.</p>
                    </li>
                    <li className="bg-secondary-50 p-4 rounded-lg">
                      <h4 className="font-medium text-secondary-900 mb-1">FORS (Forest of Random Subsets)</h4>
                      <p className="text-sm text-secondary-700">A few-time signature scheme that adds security against multi-target attacks.</p>
                    </li>
                    <li className="bg-secondary-50 p-4 rounded-lg">
                      <h4 className="font-medium text-secondary-900 mb-1">Hypertree</h4>
                      <p className="text-sm text-secondary-700">A multi-layered Merkle tree structure that enables multiple signatures with one key pair.</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-secondary-900">Key Benefits</h3>
                  <div className="space-y-4">
                    <div className="flex bg-secondary-50 p-4 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-secondary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 mb-1">Minimal Security Assumptions</h4>
                        <p className="text-sm text-secondary-700">Relies solely on the security of cryptographic hash functions, without additional mathematical assumptions.</p>
                      </div>
                    </div>
                    <div className="flex bg-secondary-50 p-4 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-secondary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 mb-1">Parameter Flexibility</h4>
                        <p className="text-sm text-secondary-700">Multiple parameterizations allowing trade-offs between signature size, key size, and generation/verification time.</p>
                      </div>
                    </div>
                    <div className="flex bg-secondary-50 p-4 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-secondary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 mb-1">Hash Function Choices</h4>
                        <p className="text-sm text-secondary-700">Support for both traditional hash functions (SHA-2) and XOF (SHAKE), providing implementation flexibility.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Applications */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Real-World Applications</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <p className="text-secondary-800 mb-6">
                  SLH-DSA is particularly well-suited for applications where long-term security and minimal assumptions
                  are critical, even at the cost of larger signatures or slower processing.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Critical Infrastructure</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Securing infrastructure control systems and firmware updates with conservatively secure long-term signatures.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Archival Signing</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Document preservation and archival systems that need verifiable signatures over extremely long time periods.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Legal Documents</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Legally binding documents and contracts requiring high-assurance signatures with conservative security assumptions.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link href="/" className="text-secondary-600 hover:text-secondary-800 font-medium inline-flex items-center">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Algorithms
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-secondary-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>PQC Visualization - Explore Post-Quantum Cryptography Standards</p>
          <p className="text-secondary-400 text-sm mt-2">A demonstration of NIST&apos;s FIPS 203, 204, and 205 standards</p>
        </div>
      </footer>
    </div>
  );
} 