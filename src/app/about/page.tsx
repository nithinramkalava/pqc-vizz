'use client';

import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">About PQC Visualization</h1>
            </div>
            <p className="text-xl text-primary-100 mb-6">
              A JavaScript implementation of NIST&apos;s Post-Quantum Cryptography Standards
            </p>
            <div className="bg-primary-600/50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 justify-between">
                <div>
                  <div className="text-sm text-primary-200">Project</div>
                  <div className="font-medium">Major Project for BTech Computer Science</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">Author</div>
                  <div className="font-medium">Nithin Ram Kalava</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">Institution</div>
                  <div className="font-medium">Vasireddy Venkatadri Institute of Technology</div>
                </div>
                <div>
                  <div className="text-sm text-primary-200">NPM Package</div>
                  <div className="font-medium">
                    <a href="https://www.npmjs.com/package/pqc" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      npmjs.com/package/pqc
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow bg-primary-50">
        <div className="container mx-auto px-4 py-12">
          
          {/* About the Project */}
          <section className="mb-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-1 p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary-900">About the Project</h2>
                  <p className="text-primary-800 mb-4">
                    This project provides a visualization and exploration of NIST&apos;s post-quantum cryptography standards,
                    powered by the <a href="https://www.npmjs.com/package/pqc" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">pqc</a> JavaScript library.
                    The library implements all three quantum-resistant algorithms standardized by NIST in their Federal 
                    Information Processing Standards (FIPS).
                  </p>
                  <p className="text-primary-800 mb-4">
                    This application was developed as a major project for my BTech Computer Science degree at 
                    Vasireddy Venkatadri Institute of Technology, India. It aims to help developers understand and 
                    visualize post-quantum cryptographic algorithms to prepare for the quantum computing era.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <a href="https://www.npmjs.com/package/pqc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 576 512" fill="currentColor">
                        <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"/>
                      </svg>
                      NPM Package
                    </a>
                    <Link href="/" className="inline-flex items-center px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-800 rounded-lg">
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Explore Algorithms
                    </Link>
                  </div>
                </div>
                <div className="md:w-96 bg-primary-50 p-8">
                  <h3 className="text-xl font-semibold mb-4 text-primary-900">Implemented Algorithms</h3>
                  <div className="space-y-4">
                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg text-primary-700 font-bold">
                        KEM
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary-900">ML-KEM</h4>
                        <p className="text-sm text-primary-700">Module-Lattice-based Key Encapsulation Mechanism (FIPS 203)</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-200 rounded-lg text-primary-800 font-bold">
                        DSA
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary-900">ML-DSA</h4>
                        <p className="text-sm text-primary-700">Module-Lattice-based Digital Signature Algorithm (FIPS 204)</p>
                      </div>
                    </div>

                    <div className="flex p-3 bg-white rounded-lg shadow-sm">
                      <div className="mr-4 flex-shrink-0 h-12 w-12 flex items-center justify-center bg-primary-300 rounded-lg text-primary-900 font-bold">
                        SLH
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary-900">SLH-DSA</h4>
                        <p className="text-sm text-primary-700">Stateless Hash-based Digital Signature Algorithm (FIPS 205)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Author Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Author</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="md:flex items-center">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="h-48 w-48 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-5xl font-bold">
                    NRK
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <h3 className="text-2xl font-semibold text-primary-900 mb-2">Nithin Ram Kalava</h3>
                  <p className="text-primary-600 mb-4">Dept. Computer Science, Vasireddy Venkatadri Institute of Technology, India</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:contact@nithinram.com" className="text-primary-700 hover:underline">contact@nithinram.com</a>
                    </div>
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-primary-800">
                      This project was developed as part of my BTech Computer Science degree. 
                      The implementation and research aim to make post-quantum cryptography more accessible
                      to web developers through JavaScript implementation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Research Paper */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Research Paper</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-bold text-primary-900 mb-4">Post-Quantum Security for Web Applications</h3>
                
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-semibold text-primary-900 mb-2">Abstract</h4>
                  <p className="text-primary-800 text-sm">
                    The emergence of quantum computing presents an unprecedented threat to current cryptographic systems. 
                    With sufficient quantum computing capabilities, Shor&apos;s algorithm will efficiently break widely used 
                    public-key cryptography like Rivest-Shamir-Adleman (RSA) and Elliptic Curve Cryptography (ECC). 
                    To counter this threat, the National Institute of Standards and Technology (NIST) has standardized 
                    three quantum-resistant algorithms in their Federal Information Processing Standards (FIPS): 
                    Module-Lattice-based Key Encapsulation Mechanism (ML-KEM) for key encapsulation, 
                    Module-Lattice-based Digital Signature Algorithm (ML-DSA) for digital signatures, and 
                    Stateless Hash-based Digital Signature Algorithm (SLH-DSA) for hash-based signatures. 
                    This paper presents &apos;pqc&apos;, a JavaScript implementation of these standards available as a 
                    Node Package Manager (npm) package. Our implementation achieves practical performance on modern hardware, 
                    with ML-KEM-768 performing 2,305 operations per second for key generation and ML-DSA65 achieving 
                    386 operations per second for signing operations. The library enables developers to integrate 
                    post-quantum cryptography into web applications, helping prepare current systems for the quantum computing era.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-3">Key Benchmarks</h4>
                    <div className="space-y-4">
                      <div className="border border-primary-100 rounded-lg overflow-hidden">
                        <div className="bg-primary-50 p-3 border-b border-primary-100">
                          <h5 className="font-medium text-primary-800">ML-KEM Performance</h5>
                        </div>
                        <div className="p-3">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-primary-50">
                                <th className="px-3 py-2 text-left font-semibold text-primary-900">Operation</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-KEM-512</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-KEM-768</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-KEM-1024</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">keygen</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">3,784 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">2,305 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">1,510 op/s</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">encrypt</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">3,283 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">1,993 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">1,366 op/s</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">decrypt</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">3,450 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">2,035 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">1,343 op/s</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="border border-primary-100 rounded-lg overflow-hidden">
                        <div className="bg-primary-50 p-3 border-b border-primary-100">
                          <h5 className="font-medium text-primary-800">ML-DSA Performance</h5>
                        </div>
                        <div className="p-3">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="bg-primary-50">
                                <th className="px-3 py-2 text-left font-semibold text-primary-900">Operation</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-DSA44</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-DSA65</th>
                                <th className="px-3 py-2 text-right font-semibold text-primary-900">ML-DSA87</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">keygen</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">669 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">386 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">236 op/s</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">sign</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">123 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">120 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">78 op/s</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 border-t border-primary-100 font-medium text-primary-900">verify</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">618 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">367 op/s</td>
                                <td className="px-3 py-2 border-t border-primary-100 text-right text-primary-900">220 op/s</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-3">Implementation Highlights</h4>
                    <div className="space-y-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-900 mb-2 flex items-center">
                          <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Quantum Resistance
                        </h5>
                        <p className="text-sm text-primary-700">
                          Implements algorithms specifically designed to resist attacks from quantum computers,
                          including Shor&apos;s algorithm which threatens current cryptographic standards.
                        </p>
                      </div>
                      
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-900 mb-2 flex items-center">
                          <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Performance Optimized
                        </h5>
                        <p className="text-sm text-primary-700">
                          Achieves practical performance for web applications, with thousands of operations
                          per second for key generation and hundreds for signing operations.
                        </p>
                      </div>
                      
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-900 mb-2 flex items-center">
                          <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Pure JavaScript Implementation
                        </h5>
                        <p className="text-sm text-primary-700">
                          Implemented entirely in JavaScript to ensure wide compatibility across web browsers
                          and Node.js environments without requiring native code extensions.
                        </p>
                      </div>
                      
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <h5 className="font-medium text-primary-900 mb-2 flex items-center">
                          <svg className="h-5 w-5 text-primary-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          NIST FIPS Compliant
                        </h5>
                        <p className="text-sm text-primary-700">
                          Strictly adheres to the NIST Federal Information Processing Standards (FIPS) 203, 204, and 205,
                          ensuring compatibility with regulatory requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <a 
                    href="https://www.npmjs.com/package/pqc" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center mr-4"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 576 512" fill="currentColor">
                      <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"/>
                    </svg>
                    Explore npm Package
                  </a>
                  <a 
                    href="/Post-Quantum%20Security%20for%20Web%20Applications.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    View Full Paper (PDF)
                  </a>
                </div>
              </div>
            </div>
          </section>
          
          {/* Paper Preview Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Research Paper</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="md:flex gap-8">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="border border-primary-200 rounded-lg overflow-hidden shadow-md">
                    <div className="relative bg-gray-100 flex items-center justify-center">
                      <Image 
                        src="/paper-preview.png" 
                        alt="Research paper preview" 
                        width={500}
                        height={647}
                        className="w-full hover:opacity-95 transition-opacity"
                      />
                    </div>
                    <div className="p-4 bg-primary-50">
                      <h3 className="font-semibold text-primary-900 text-lg mb-2">Post-Quantum Security for Web Applications</h3>
                      <p className="text-primary-800 text-sm mb-4">Nithin Ram Kalava, Dept. Computer Science, Vasireddy Venkatadri Institute of Technology</p>
                      <a 
                        href="/Post-Quantum%20Security%20for%20Web%20Applications.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-primary-700 hover:text-primary-900 font-medium"
                      >
                        <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Full Paper
                      </a>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-primary-900 mb-4">Key Findings</h3>
                  <div className="space-y-4">
                    <div className="flex p-4 bg-primary-50 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900 mb-1">Practical Performance</h4>
                        <p className="text-primary-800">ML-KEM-768 achieves 2,305 operations per second for key generation, making it viable for real-time web applications.</p>
                      </div>
                    </div>
                    <div className="flex p-4 bg-primary-50 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900 mb-1">FIPS Standards Implementation</h4>
                        <p className="text-primary-800">Successfully implemented the three NIST standardized algorithms (ML-KEM, ML-DSA, SLH-DSA) in JavaScript.</p>
                      </div>
                    </div>
                    <div className="flex p-4 bg-primary-50 rounded-lg">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-900 mb-1">Algorithm Tradeoffs</h4>
                        <p className="text-primary-800">Different security levels and implementation variants offer tradeoffs between performance, key size, and security level.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <a 
                      href="/Post-Quantum%20Security%20for%20Web%20Applications.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-lg inline-flex items-center"
                    >
                      <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Read Full Research Paper
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact & Resources */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Contact & Resources</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-primary-600 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-primary-900">Email</h4>
                        <a href="mailto:contact@nithinram.com" className="text-primary-700 hover:underline">contact@nithinram.com</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-primary-50 p-4 rounded-lg">
                    <p className="text-primary-800 text-sm">
                      Feel free to reach out with questions about the library implementation, suggestions 
                      for improvement, or to discuss post-quantum cryptography applications for your project.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Resources</h3>
                  <div className="space-y-3">
                    <a href="https://www.npmjs.com/package/pqc" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <svg className="h-6 w-6 text-primary-600 mr-3" viewBox="0 0 576 512" fill="currentColor">
                        <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"/>
                      </svg>
                      <div>
                        <div className="font-medium text-primary-900">NPM Package</div>
                        <div className="text-sm text-primary-700">pqc - Post-Quantum Cryptography Library</div>
                      </div>
                    </a>
                    
                    <a href="https://doi.org/10.6028/NIST.FIPS.203" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <svg className="h-6 w-6 text-primary-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-primary-900">NIST FIPS 203</div>
                        <div className="text-sm text-primary-700">Module-Lattice-Based Key-Encapsulation Mechanism Standard</div>
                      </div>
                    </a>
                    
                    <a href="https://doi.org/10.6028/NIST.FIPS.204" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <svg className="h-6 w-6 text-primary-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-primary-900">NIST FIPS 204</div>
                        <div className="text-sm text-primary-700">Module-Lattice-Based Digital Signature Standard</div>
                      </div>
                    </a>
                    
                    <a href="https://doi.org/10.6028/NIST.FIPS.205" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <svg className="h-6 w-6 text-primary-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-primary-900">NIST FIPS 205</div>
                        <div className="text-sm text-primary-700">Stateless Hash-Based Digital Signature Standard</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-primary-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>PQC Visualization - Explore Post-Quantum Cryptography Standards</p>
          <p className="text-primary-400 text-sm mt-2">A demonstration of NIST&apos;s FIPS 203, 204, and 205 standards</p>
        </div>
      </footer>
    </div>
  );
} 