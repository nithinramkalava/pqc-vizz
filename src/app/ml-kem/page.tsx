'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import CryptoVisualizer from '../components/CryptoVisualizer';
import { ml_kem } from 'pqc';
import Link from 'next/link';

export default function MLKEMPage() {
  const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const visualizationRef = useRef<HTMLDivElement>(null);

  const mlKemLevels = [
    { label: 'ML-KEM-512 (128-bit security)', value: 'ml_kem512' },
    { label: 'ML-KEM-768 (192-bit security)', value: 'ml_kem768' },
    { label: 'ML-KEM-1024 (256-bit security)', value: 'ml_kem1024' }
  ];

  const operations = [
    'Key Generation',
    'Encapsulation',
    'Decapsulation',
    'Complete KEM Flow'
  ];

  const executeMLKEM = async (operation: string, securityLevel: string) => {
    // Get algorithm based on security level
    const algorithm = ml_kem[securityLevel as keyof typeof ml_kem];
    
    if (!algorithm) {
      throw new Error(`Algorithm ${securityLevel} not found`);
    }

    // Process based on selected operation
    switch (operation) {
      case 'Key Generation': {
        const startTime = performance.now();
        const keyPair = algorithm.keygen();
        const endTime = performance.now();
        return {
          publicKey: Array.from(keyPair.publicKey),
          secretKey: Array.from(keyPair.secretKey),
          publicKeySize: keyPair.publicKey.length,
          secretKeySize: keyPair.secretKey.length,
          executionTime: `${(endTime - startTime).toFixed(2)}ms`
        };
      }
      
      case 'Encapsulation': {
        // Alice generates keys
        const aliceKeys = algorithm.keygen();
        
        // Bob encapsulates a shared secret using Alice's public key
        const startTime = performance.now();
        const { cipherText, sharedSecret } = algorithm.encapsulate(aliceKeys.publicKey);
        const endTime = performance.now();
        
        return {
          publicKey: Array.from(aliceKeys.publicKey),
          cipherText: Array.from(cipherText),
          sharedSecret: Array.from(sharedSecret),
          cipherTextSize: cipherText.length,
          sharedSecretSize: sharedSecret.length,
          executionTime: `${(endTime - startTime).toFixed(2)}ms`
        };
      }
      
      case 'Decapsulation': {
        // Alice generates keys
        const aliceKeys = algorithm.keygen();
        
        // Bob encapsulates using Alice's public key
        const { cipherText, sharedSecret: bobSharedSecret } = algorithm.encapsulate(aliceKeys.publicKey);
        
        // Alice decapsulates to retrieve the same shared secret
        const startTime = performance.now();
        const aliceSharedSecret = algorithm.decapsulate(cipherText, aliceKeys.secretKey);
        const endTime = performance.now();
        
        // Verify both shared secrets match
        const secretsMatch = Buffer.compare(aliceSharedSecret, bobSharedSecret) === 0;
        
        return {
          secretKey: Array.from(aliceKeys.secretKey),
          cipherText: Array.from(cipherText),
          sharedSecret: Array.from(bobSharedSecret),
          aliceSharedSecret: Array.from(aliceSharedSecret),
          secretsMatch: secretsMatch,
          executionTime: `${(endTime - startTime).toFixed(2)}ms`
        };
      }
      
      case 'Complete KEM Flow': {
        // Generate a full flow with all steps
        
        // 1. [Alice] generates a key pair
        const startKeyGen = performance.now();
        const aliceKeys = algorithm.keygen();
        const endKeyGen = performance.now();
        
        // 2. [Bob] encapsulates a shared secret using Alice's public key
        const startEncaps = performance.now();
        const { cipherText, sharedSecret: bobSharedSecret } = algorithm.encapsulate(aliceKeys.publicKey);
        const endEncaps = performance.now();
        
        // 3. [Alice] decapsulates the ciphertext to get the same shared secret
        const startDecaps = performance.now();
        const aliceSharedSecret = algorithm.decapsulate(cipherText, aliceKeys.secretKey);
        const endDecaps = performance.now();
        
        // 4. Verify that both shared secrets match
        const secretsMatch = Buffer.compare(aliceSharedSecret, bobSharedSecret) === 0;
        
        // Save flow for visualization
        setFlow({
          alicePublicKey: Array.from(aliceKeys.publicKey).slice(0, 10),
          alicePrivateKey: Array.from(aliceKeys.secretKey).slice(0, 10),
          bobSharedSecret: Array.from(bobSharedSecret).slice(0, 10),
          cipherText: Array.from(cipherText).slice(0, 10),
          aliceSharedSecret: Array.from(aliceSharedSecret).slice(0, 10),
          secretsMatch: secretsMatch
        });
        
        return {
          publicKey: Array.from(aliceKeys.publicKey),
          secretKey: Array.from(aliceKeys.secretKey),
          cipherText: Array.from(cipherText),
          sharedSecret: Array.from(bobSharedSecret),
          aliceSharedSecret: Array.from(aliceSharedSecret),
          secretsMatch: secretsMatch,
          keyGeneration: {
            publicKey: Array.from(aliceKeys.publicKey),
            secretKey: Array.from(aliceKeys.secretKey),
            publicKeySize: aliceKeys.publicKey.length,
            secretKeySize: aliceKeys.secretKey.length,
            executionTime: `${(endKeyGen - startKeyGen).toFixed(2)}ms`
          },
          encapsulation: {
            publicKey: Array.from(aliceKeys.publicKey),
            cipherText: Array.from(cipherText),
            sharedSecret: Array.from(bobSharedSecret),
            cipherTextSize: cipherText.length,
            sharedSecretSize: bobSharedSecret.length,
            executionTime: `${(endEncaps - startEncaps).toFixed(2)}ms`
          },
          decapsulation: {
            secretKey: Array.from(aliceKeys.secretKey),
            cipherText: Array.from(cipherText),
            sharedSecret: Array.from(aliceSharedSecret),
            secretsMatch: secretsMatch,
            executionTime: `${(endDecaps - startDecaps).toFixed(2)}ms`
          },
          totalExecutionTime: `${(endDecaps - startKeyGen).toFixed(2)}ms`
        };
      }
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  };

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

  // Animation sequence for the KEM flow
  const animateSequence = () => {
    const totalSteps = 4; // Total animation steps
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-primary-700 to-primary-900 z-0"></div>
      <Header colorScheme="primary" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-12 pt-28 relative z-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="mr-4 bg-white p-3 rounded-full">
                <svg className="h-8 w-8 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">ML-KEM: Multi-Lattice Key Encapsulation Mechanism</h1>
            </div>
            <p className="text-xl text-primary-100 mb-6">
              A quantum-resistant key exchange algorithm standardized in FIPS 203
            </p>
            <div className="bg-primary-600/50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <div className="text-sm text-primary-200">Security Basis</div>
                  <div className="font-medium">Module Learning With Errors (MLWE)</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">Primary Use</div>
                  <div className="font-medium">Secure Key Exchange</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">Replaces</div>
                  <div className="font-medium">RSA & ECC Key Exchange</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">Previously Known As</div>
                  <div className="font-medium">CRYSTALS-Kyber</div>
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
                  <h2 className="text-2xl font-bold mb-6 text-secondary-900">About ML-KEM</h2>
                  <p className="text-secondary-800 mb-4">
                    ML-KEM (previously known as CRYSTALS-Kyber) is a lattice-based key encapsulation mechanism standardized
                    by NIST as FIPS 203. It provides a quantum-resistant way to establish shared secret keys between parties.
                  </p>
                  <p className="text-secondary-800 mb-4">
                    The algorithm is based on the hardness of the Module Learning With Errors (MLWE) problem, making it
                    resistant to attacks from both classical and quantum computers.
                  </p>
                  <p className="text-secondary-800">
                    ML-KEM is designed to replace current key exchange algorithms like RSA and Elliptic Curve Diffie-Hellman (ECDH)
                    in TLS and other protocols, ensuring that encrypted communications remain secure even in the quantum era.
                  </p>
                </div>
                <div className="md:w-96 bg-primary-50 p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary-900">Security Levels</h3>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-700 font-bold">
                        512
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-KEM-512</h4>
                        <p className="text-sm text-secondary-700">128-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-200 rounded-lg text-primary-800 font-bold">
                        768
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-KEM-768</h4>
                        <p className="text-sm text-secondary-700">192-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-300 rounded-lg text-primary-900 font-bold">
                        1024
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-KEM-1024</h4>
                        <p className="text-sm text-secondary-700">256-bit security level</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Key Exchange Visualization */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">How ML-KEM Works</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-primary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-700 mb-2">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary-900">1. Key Generation</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Alice generates a key pair consisting of a public key and a secret key, based on 
                      randomly sampled polynomials in a special ring.
                    </p>
                    <div className="mt-auto pt-4 border-t border-primary-200">
                      <div className="text-sm text-primary-800">
                        <span className="font-medium">Output:</span> Public Key, Secret Key
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-accent-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 text-accent-700 mb-2">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-accent-900">2. Encapsulation</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Bob takes Alice&apos;s public key, generates a random value, and uses it to derive a shared 
                      secret. He also creates a ciphertext to send to Alice.
                    </p>
                    <div className="mt-auto pt-4 border-t border-accent-200">
                      <div className="text-sm text-accent-800">
                        <span className="font-medium">Input:</span> Alice&apos;s Public Key<br/>
                        <span className="font-medium">Output:</span> Ciphertext, Shared Secret
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-secondary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-700 mb-2">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900">3. Decapsulation</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Alice uses her secret key and the ciphertext from Bob to recover the same shared secret, 
                      without any further communication.
                    </p>
                    <div className="mt-auto pt-4 border-t border-secondary-200">
                      <div className="text-sm text-secondary-800">
                        <span className="font-medium">Input:</span> Alice&apos;s Secret Key, Bob&apos;s Cipher Text<br/>
                        <span className="font-medium">Output:</span> Shared Secret
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-secondary-800 mb-6">
                  The shared secret derived by both parties can then be used as a symmetric encryption key to secure their communications.
                </div>
                <button 
                  onClick={() => executeMLKEM('Complete KEM Flow', 'ml_kem768')}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center"
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
          
          {/* ML-KEM Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">ML-KEM Operations</h2>
            <CryptoVisualizer
              title="ML-KEM Operations"
              description="Explore ML-KEM's key generation, encapsulation, and decapsulation operations at different security levels."
              operationTypes={operations}
              securityLevels={mlKemLevels}
              onExecute={executeMLKEM}
            />
          </section>
          
          {/* Flow Visualization */}
          {flow && (
            <section className="mb-12" ref={visualizationRef}>
              <h2 className="text-2xl font-bold mb-6 text-secondary-900">Key Exchange Flow Visualization</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                  {/* Flow diagram */}
                  <div className="flex flex-col md:flex-row items-center justify-center w-full">
                    {/* Alice Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-blue-50 rounded-xl border border-blue-200 p-6 transition-all duration-500 
                        ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-blue-900">Alice</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 
                            ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-blue-800 mb-2">1. Generates Key Pair</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Public Key:</strong> {Array.isArray(flow.alicePublicKey) ? 
                                `[${flow.alicePublicKey.join(', ')}${flow.alicePublicKey.length < 10 ? '' : '...'}]` : 
                                flow.alicePublicKey as React.ReactNode}</p>
                              <p><strong>Private Key:</strong> {Array.isArray(flow.alicePrivateKey) ? 
                                `[${flow.alicePrivateKey.join(', ')}${flow.alicePrivateKey.length < 10 ? '' : '...'}]` :  
                                flow.alicePrivateKey as React.ReactNode}</p>
                            </div>
                          </div>
                          
                          <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-700
                            ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-blue-800 mb-2">4. Decapsulates Shared Secret</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Shared Secret:</strong> {Array.isArray(flow.aliceSharedSecret) ? 
                                `[${flow.aliceSharedSecret.join(', ')}${flow.aliceSharedSecret.length < 10 ? '' : '...'}]` : 
                                flow.aliceSharedSecret as React.ReactNode}</p>
                              {animationComplete && (flow.secretsMatch as boolean) && (
                                <p className="mt-2 text-green-600 font-semibold">✓ Matches Bob&apos;s secret</p>
                              )}
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
                    
                    {/* Bob Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-green-50 rounded-xl border border-green-200 p-6 transition-all duration-500 
                        ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-green-900">Bob</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                            ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-green-800 mb-2">2. Receives Alice&apos;s Public Key</p>
                          </div>
                          
                          <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                            ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-green-800 mb-2">3. Encapsulates Shared Secret</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Ciphertext:</strong> {Array.isArray(flow.cipherText) ? 
                                `[${flow.cipherText.join(', ')}${flow.cipherText.length < 10 ? '' : '...'}]` : 
                                flow.cipherText as React.ReactNode}</p>
                              <p><strong>Shared Secret:</strong> {Array.isArray(flow.bobSharedSecret) ? 
                                `[${flow.bobSharedSecret.join(', ')}${flow.bobSharedSecret.length < 10 ? '' : '...'}]` : 
                                flow.bobSharedSecret as React.ReactNode}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all duration-700 
                  ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800 mb-1">Security Note:</p>
                      <p className="text-sm text-yellow-700">
                        During an actual key exchange, only the public key and ciphertext would be transmitted across 
                        the network. The shared secret and private key remain confidential to each party.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* Interactive Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Interactive ML-KEM Demo</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-700 mb-4">
                  <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">Try ML-KEM Key Exchange with AES</h3>
                <p className="text-secondary-700 max-w-2xl mx-auto mb-6">
                  Experience the full ML-KEM workflow with our interactive implementation. Generate keys, encapsulate and decapsulate shared secrets, then use the resulting key for AES encryption and decryption.
                </p>
                <Link href="/ml-kem/try-mlkem" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Interactive ML-KEM Demo
                </Link>
              </div>
            </div>
          </section>
          
          {/* Applications */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Real-World Applications</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <p className="text-secondary-800 mb-6">
                  ML-KEM is designed to be integrated into existing protocols and applications to provide quantum resistance.
                  Here are some common use cases:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">TLS/SSL Protocols</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Securing web traffic with quantum-resistant key exchange in HTTPS connections.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Secure Messaging</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      End-to-end encrypted messaging apps for long-term security against quantum attacks.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">VPN Tunnels</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Quantum-safe VPN connections for secure remote access and corporate networking.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link href="/" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
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