'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import CryptoVisualizer from '../components/CryptoVisualizer';
import { ml_dsa } from 'pqc';
import { utf8ToBytes } from 'pqc/utilities/utils';
import Link from 'next/link';

export default function MLDSAPage() {
  const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const visualizationRef = useRef<HTMLDivElement>(null);

  const mlDsaLevels = [
    { label: 'ML-DSA-44 (128-bit security)', value: 'ml_dsa44' },
    { label: 'ML-DSA-65 (192-bit security)', value: 'ml_dsa65' },
    { label: 'ML-DSA-87 (256-bit security)', value: 'ml_dsa87' }
  ];

  const operations = [
    'Key Generation',
    'Sign Message',
    'Verify Signature',
    'Complete DSA Flow'
  ];

  const executeMLDSA = async (operation: string, securityLevel: string, inputMessage?: string) => {
    // Get algorithm based on security level
    const algorithm = ml_dsa[securityLevel as keyof typeof ml_dsa];
    
    if (!algorithm) {
      throw new Error(`Algorithm ${securityLevel} not found`);
    }

    // Convert user message to bytes or use default message if none provided
    const defaultMessage = "This is a default test message for ML-DSA signature.";
    const messageStr = inputMessage || defaultMessage;
    const message = utf8ToBytes(messageStr);

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
      
      case 'Sign Message': {
        const keyPair = algorithm.keygen();
        
        const startTime = performance.now();
        const signature = algorithm.sign(keyPair.secretKey, message);
        const endTime = performance.now();
        
        return {
          message: messageStr,
          signature: Array.from(signature),
          signatureSize: signature.length,
          executionTime: `${(endTime - startTime).toFixed(2)}ms`
        };
      }
      
      case 'Verify Signature': {
        const keyPair = algorithm.keygen();
        const signature = algorithm.sign(keyPair.secretKey, message);
        
        const startTime = performance.now();
        const isValid = algorithm.verify(keyPair.publicKey, message, signature);
        const endTime = performance.now();
        
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
          isValid: isValid
        });
        
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header colorScheme="accent" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-accent-700 to-accent-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="mr-4 bg-white p-3 rounded-full">
                <svg className="h-8 w-8 text-accent-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">ML-DSA: Multi-Lattice Digital Signature Algorithm</h1>
            </div>
            <p className="text-xl text-accent-100 mb-6">
              A quantum-resistant digital signature algorithm standardized in FIPS 204
            </p>
            <div className="bg-accent-600/50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <div className="text-sm text-accent-200">Security Basis</div>
                  <div className="font-medium">Module Learning With Errors (MLWE)</div>
                </div>
                <div>
                  <div className="text-sm text-accent-200">Primary Use</div>
                  <div className="font-medium">Digital Signatures</div>
                </div>
                <div>
                  <div className="text-sm text-accent-200">Replaces</div>
                  <div className="font-medium">RSA & ECDSA Signatures</div>
                </div>
                <div>
                  <div className="text-sm text-accent-200">Previously Known As</div>
                  <div className="font-medium">CRYSTALS-Dilithium</div>
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
                  <h2 className="text-2xl font-bold mb-6 text-secondary-900">About ML-DSA</h2>
                  <p className="text-secondary-800 mb-4">
                    ML-DSA (previously known as CRYSTALS-Dilithium) is a lattice-based digital signature algorithm standardized
                    by NIST as FIPS 204. It provides a quantum-resistant way to generate and verify digital signatures.
                  </p>
                  <p className="text-secondary-800 mb-4">
                    Like ML-KEM, the algorithm is based on the hardness of the Module Learning With Errors (MLWE) problem,
                    making it resistant to attacks from both classical and quantum computers.
                  </p>
                  <p className="text-secondary-800">
                    ML-DSA is designed to replace current digital signature algorithms like RSA and ECDSA (Elliptic Curve
                    Digital Signature Algorithm) in applications requiring document signing, code signing, certificate validation,
                    and more.
                  </p>
                </div>
                <div className="md:w-96 bg-accent-50 p-8">
                  <h3 className="text-xl font-semibold mb-4 text-accent-900">Security Levels</h3>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-accent-100 rounded-lg text-accent-700 font-bold">
                        44
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-DSA-44</h4>
                        <p className="text-sm text-secondary-700">128-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-accent-200 rounded-lg text-accent-800 font-bold">
                        65
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-DSA-65</h4>
                        <p className="text-sm text-secondary-700">192-bit security level</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-accent-300 rounded-lg text-accent-900 font-bold">
                        87
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900">ML-DSA-87</h4>
                        <p className="text-sm text-secondary-700">256-bit security level</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Signature Process Visualization */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">How ML-DSA Works</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-accent-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 text-accent-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-accent-900">1. Key Generation</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      The signer generates a key pair consisting of a public key that will be published and a secret key
                      that is kept confidential.
                    </p>
                    <div className="mt-auto pt-4 border-t border-accent-200">
                      <div className="text-sm text-accent-800">
                        <span className="font-medium">Output:</span> Public Key, Secret Key
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="h-full flex flex-col bg-primary-50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-700 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary-900">2. Signing</h3>
                    </div>
                    <p className="text-secondary-800 mb-4">
                      The signer uses their secret key to create a digital signature for a message, which serves as proof
                      of authenticity.
                    </p>
                    <div className="mt-auto pt-4 border-t border-primary-200">
                      <div className="text-sm text-primary-800">
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
                      Anyone can verify the signature&apos;s authenticity using the signer&apos;s public key, confirming the message
                      hasn&apos;t been altered.
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
                  The signature provides cryptographic proof that the person who possesses the secret key has attested to the contents of the message.
                </div>
                <button 
                  onClick={() => {
                    const testMessage = "This is a test message for ML-DSA visualization";
                    executeMLDSA('Complete DSA Flow', 'ml_dsa65', testMessage);
                  }}
                  className="bg-accent-600 hover:bg-accent-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center"
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
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Try ML-DSA Operations</h2>
            <CryptoVisualizer
              title="ML-DSA Operations"
              description="Explore ML-DSA's key generation, signing, and verification operations at different security levels."
              operationTypes={operations}
              securityLevels={mlDsaLevels}
              onExecute={executeMLDSA}
            />
          </section>
          
          {/* Flow Visualization */}
          {flow && (
            <section className="mb-12" ref={visualizationRef}>
              <h2 className="text-2xl font-bold mb-6 text-secondary-900">Signature Flow Visualization</h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                  {/* Flow diagram */}
                  <div className="flex flex-col md:flex-row items-center justify-center w-full">
                    {/* Signer Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-purple-50 rounded-xl border border-purple-200 p-6 transition-all duration-500 
                        ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-purple-900">Signer</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-purple-100 transition-all duration-500 
                            ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-purple-800 mb-2">1. Generates Key Pair</p>
                            <div className="text-xs space-y-1 text-secondary-800">
                              <p><strong>Public Key:</strong> {flow.signerPublicKey as React.ReactNode}</p>
                              <p><strong>Private Key:</strong> {flow.signerPrivateKey as React.ReactNode}</p>
                            </div>
                          </div>
                          
                          <div className={`bg-white rounded-lg p-4 border border-purple-100 transition-all duration-500 
                            ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-purple-800 mb-2">2. Signs Message</p>
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
                      
                      <div className="hidden md:block w-full h-0.5 bg-secondary-200 my-2"></div>
                      <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                    </div>
                    
                    {/* Verifier Side */}
                    <div className="w-full md:w-5/12 p-4">
                      <div className={`bg-orange-50 rounded-xl border border-orange-200 p-6 transition-all duration-500 
                        ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-orange-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-orange-900">Verifier</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`bg-white rounded-lg p-4 border border-orange-100 transition-all duration-500 
                            ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <p className="text-sm font-medium text-orange-800 mb-2">3. Verifies Signature</p>
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
                        In a real-world scenario, the signature and public key are shared openly, but the private key must remain 
                        securely with the signer. If the message were altered in any way, the verification would fail.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {/* Applications */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-secondary-900">Real-World Applications</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <p className="text-secondary-800 mb-6">
                  ML-DSA can be integrated into existing applications and protocols to provide quantum-resistant digital signatures. 
                  Here are some common use cases:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Document Signing</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Secure digital certificates and document signing with quantum-resistant signatures for long-term validity.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Code Signing</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      Ensuring software authenticity with post-quantum signatures to maintain secure software distribution.
                    </p>
                  </div>
                  
                  <div className="bg-secondary-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      <svg className="h-6 w-6 mr-2 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      <h3 className="font-semibold text-secondary-900">Authentication</h3>
                    </div>
                    <p className="text-secondary-700 text-sm">
                      User and service authentication with post-quantum signatures for secure login and authorization.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link href="/" className="text-accent-600 hover:text-accent-800 font-medium inline-flex items-center">
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