'use client';

import React, { useState, useRef } from 'react';

interface CryptoResult {
  publicKey?: number[];
  secretKey?: number[];
  publicKeySize?: number;
  secretKeySize?: number;
  signature?: number[];
  cipherText?: number[];
  sharedSecret?: number[];
  message?: string;
  isValid?: boolean;
  totalExecutionTime?: string;
  executionTime?: string;
  seed?: number[];
  nonce?: number[];
  cipherTextSize?: number;
  sharedSecretSize?: number;
  signatureSize?: number;
  randomness?: number[];
  keyGeneration?: Record<string, unknown>;
  signing?: Record<string, unknown>;
  verification?: Record<string, unknown>;
  encapsulation?: Record<string, unknown>;
  decapsulation?: Record<string, unknown>;
  [key: string]: unknown;
}

interface CryptoVisualizerProps {
  title: string;
  description: string;
  operationTypes: string[];
  securityLevels: { label: string; value: string }[];
  onExecute: (operation: string, securityLevel: string, message?: string) => Promise<CryptoResult>;
}

export default function CryptoVisualizer({ 
  title, 
  description, 
  operationTypes, 
  securityLevels, 
  onExecute 
}: CryptoVisualizerProps) {
  const [selectedOperation, setSelectedOperation] = useState(operationTypes[0]);
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState(securityLevels[0].value);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<CryptoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Check if this is ML-KEM which doesn't need message input
  const isMLKEM = title.includes('ML-KEM');

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For ML-KEM operations, pass an empty string as the message
      // This keeps the function signature consistent
      const data = await onExecute(selectedOperation, selectedSecurityLevel, isMLKEM ? '' : message);
      setResult(data);
      setExpanded(false); // Reset expanded state when new results come in
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResultToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
        .then(() => {
          // Show temporary success message
          const copyBtn = document.getElementById('copy-button');
          if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-1"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg> Copied!`;
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          }
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  // Function to format arrays for display
  const formatArray = (arr: number[], expanded: boolean) => {
    if (!arr || !Array.isArray(arr)) return "[]";
    
    if (!expanded && arr.length > 20) {
      return `[${arr.slice(0, 20).join(', ')}, ... (${arr.length - 20} more items)]`;
    }
    
    return `[${arr.join(', ')}]`;
  };

  // Render a more visually appealing result
  const renderFormattedResult = (result: CryptoResult, expanded: boolean) => {
    if (!result) return null;

    const isKeyGeneration = selectedOperation === 'Key Generation';
    const isEncapsulation = selectedOperation === 'Encapsulation';
    const isDecapsulation = selectedOperation === 'Decapsulation';
    const isSigning = selectedOperation === 'Sign';
    const isVerification = selectedOperation === 'Verify';
    
    const renderArrayPreview = (arr: number[], label: string) => {
      if (!arr || !Array.isArray(arr)) return null;
      
      return (
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-secondary-900">{label}:</span>
            <span className="text-xs bg-secondary-100 px-2 py-1 rounded-full text-secondary-800">
              {arr.length} bytes
            </span>
          </div>
          <div className="mt-1 bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
            {formatArray(arr, expanded)}
          </div>
        </div>
      );
    };
    
    // Format execution times
    const renderExecutionTime = (time: string) => {
      return (
        <div className="mt-3 flex items-center text-secondary-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Execution Time:</span>
          <span className="ml-1">{time}</span>
        </div>
      );
    };
    
    // Function to render basic summary info
    const renderBasicInfo = () => {
      return (
        <div>
          {/* Common elements for each operation type */}
          {result.message && (
            <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
              <div className="font-medium text-secondary-900">Message:</div>
              <div className="mt-1 bg-white p-2 rounded border border-secondary-200 text-secondary-900">
                {result.message}
              </div>
            </div>
          )}
          
          {result.isValid !== undefined && (
            <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
              <div className="font-medium text-secondary-900">Verification Result:</div>
              <div className={`mt-1 p-2 rounded flex items-center ${result.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {result.isValid ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg> Valid</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg> Invalid</>
                )}
              </div>
            </div>
          )}
          
          {/* Signature/cipherText/sharedSecret previews */}
          {result.signature && !expanded && renderArrayPreview(result.signature, 'Signature')}
          {result.cipherText && !expanded && renderArrayPreview(result.cipherText, 'Cipher Text')}
          {result.sharedSecret && !expanded && renderArrayPreview(result.sharedSecret, 'Shared Secret')}
          
          {/* Timing Information (always shown) */}
          {result.totalExecutionTime && (
            <div className="mt-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
              <div className="font-medium text-secondary-900">Total Execution Time:</div>
              <div className="mt-1 text-secondary-900">{result.totalExecutionTime}</div>
            </div>
          )}
          
          {result.executionTime && renderExecutionTime(result.executionTime)}
        </div>
      );
    };

    // Completely expanded view for Key Generation
    if (isKeyGeneration) {
      return (
        <div>
          {/* Basic information summary */}
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
              <div className="font-medium text-center pb-1 border-b border-secondary-200 mb-2 text-secondary-900">Key Pair Summary</div>
              <div className="text-sm text-secondary-800">
                <div className="flex justify-between mb-1">
                  <span>Public Key Size:</span>
                  <span className="font-medium">{result.publicKeySize} bytes</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Secret Key Size:</span>
                  <span className="font-medium">{result.secretKeySize} bytes</span>
                </div>
                {result.executionTime && (
                  <div className="flex justify-between mt-2 pt-2 border-t border-secondary-200">
                    <span>Execution Time:</span>
                    <span className="font-medium">{result.executionTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview of keys (not expanded) */}
          {!expanded && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                <div className="font-medium text-center pb-1 border-b border-secondary-200 mb-2 text-secondary-900">Public Key Preview</div>
                <div className="text-xs text-secondary-800 mb-1">Size: {result.publicKeySize} bytes</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.publicKey || [], false)}
                </div>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                <div className="font-medium text-center pb-1 border-b border-secondary-200 mb-2 text-secondary-900">Secret Key Preview</div>
                <div className="text-xs text-secondary-800 mb-1">Size: {result.secretKeySize} bytes</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.secretKey || [], false)}
                </div>
              </div>
            </div>
          )}
          
          {/* Full key details (expanded) */}
          {expanded && (
            <div className="mt-4">
              <div className="mb-4">
                <div className="font-medium text-secondary-900 mb-2">Public Key (full):</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.publicKey || [], true)}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="font-medium text-secondary-900 mb-2">Secret Key (full):</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.secretKey || [], true)}
                </div>
              </div>
              
              {/* If there's any algorithm-specific data in expanded view */}
              {result.seed && (
                <div className="mt-3">
                  <div className="font-medium text-secondary-900 mb-1">Seed:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(result.seed || [], true)}
                  </div>
                </div>
              )}
              
              {result.nonce && (
                <div className="mt-3">
                  <div className="font-medium text-secondary-900 mb-1">Nonce:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(result.nonce || [], true)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Encapsulation operation (ML-KEM)
    if (isEncapsulation) {
      return (
        <div>
          {/* Basic summary (always shown) */}
          <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
            <div className="font-medium text-secondary-900">Encapsulation Summary:</div>
            <div className="mt-1 text-sm text-secondary-800">
              <div>Cipher Text Size: {String(result.cipherTextSize || (result.cipherText ? result.cipherText.length : 0))} bytes</div>
              <div>Shared Secret Size: {String(result.sharedSecretSize || (result.sharedSecret ? result.sharedSecret.length : 0))} bytes</div>
              {result.executionTime && <div>Time: {result.executionTime}</div>}
            </div>
          </div>
          
          {/* Preview (not expanded) */}
          {!expanded && (
            <React.Fragment>
              {result.cipherText && renderArrayPreview(result.cipherText, 'Cipher Text')}
              {result.sharedSecret && renderArrayPreview(result.sharedSecret, 'Shared Secret')}
            </React.Fragment>
          )}
          
          {/* Detailed (expanded) */}
          {expanded && (
            <>
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Used Public Key:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.publicKey || (result.encapsulation && result.encapsulation.publicKey ? result.encapsulation.publicKey as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Generated Cipher Text:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.cipherText || (result.encapsulation && result.encapsulation.cipherText ? result.encapsulation.cipherText as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Derived Shared Secret:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.sharedSecret || (result.encapsulation && result.encapsulation.sharedSecret ? result.encapsulation.sharedSecret as number[] : []), true)}
                </div>
              </div>
              
              {/* Random values used in encapsulation, if available */}
              {(result.randomness || (result.encapsulation && 'randomness' in result.encapsulation)) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Randomness:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(result.randomness || (result.encapsulation && 'randomness' in result.encapsulation ? result.encapsulation.randomness as number[] : []), true)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    
    // Decapsulation operation (ML-KEM)
    if (isDecapsulation) {
      return (
        <div>
          {/* Basic summary (always shown) */}
          <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
            <div className="font-medium text-secondary-900">Decapsulation Summary:</div>
            <div className="mt-1 text-sm text-secondary-800">
              <div>Shared Secret Size: {String(result.sharedSecretSize || (result.sharedSecret ? result.sharedSecret.length : 0))} bytes</div>
              {result.executionTime && <div>Time: {result.executionTime}</div>}
            </div>
          </div>
          
          {/* Preview (not expanded) */}
          {!expanded && (
            <React.Fragment>
              {result.sharedSecret && renderArrayPreview(result.sharedSecret, 'Shared Secret')}
            </React.Fragment>
          )}
          
          {/* Detailed (expanded) */}
          {expanded && (
            <>
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Used Secret Key:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.secretKey || (result.decapsulation && result.decapsulation.secretKey ? result.decapsulation.secretKey as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Input Cipher Text:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.cipherText || (result.decapsulation && result.decapsulation.cipherText ? result.decapsulation.cipherText as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Derived Shared Secret:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.sharedSecret || (result.decapsulation && result.decapsulation.sharedSecret ? result.decapsulation.sharedSecret as number[] : []), true)}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    
    // Signing operation (ML-DSA, SLH-DSA)
    if (isSigning) {
      return (
        <div>
          {/* Basic summary (always shown) */}
          <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
            <div className="font-medium text-secondary-900">Signing Summary:</div>
            <div className="mt-1 text-sm text-secondary-800">
              <div>Message: {result.message || ''}</div>
              <div>Signature Size: {result.signatureSize || (result.signature ? result.signature.length : 0)} bytes</div>
              {result.executionTime && <div>Time: {result.executionTime}</div>}
            </div>
          </div>
          
          {/* Preview (not expanded) */}
          {!expanded && (
            <React.Fragment>
              {result.signature && renderArrayPreview(result.signature, 'Signature')}
            </React.Fragment>
          )}
          
          {/* Detailed (expanded) */}
          {expanded && (
            <React.Fragment>
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Used Secret Key:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.secretKey || (result.signing && result.signing.secretKey ? result.signing.secretKey as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Used Public Key:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.publicKey || (result.signing && result.signing.publicKey ? result.signing.publicKey as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Full Message:</div>
                <div className="bg-white p-2 rounded border border-secondary-200 text-secondary-900">
                  {result.message || (result.signing && result.signing.message ? result.signing.message as string : '')}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Generated Signature:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.signature || (result.signing && result.signing.signature ? result.signing.signature as number[] : []), true)}
                </div>
              </div>
              
              {/* Random values used during signing, if available */}
              {(result.randomness || (result.signing && 'randomness' in result.signing)) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Randomness:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(result.randomness || (result.signing && 'randomness' in result.signing ? result.signing.randomness as number[] : []), true)}
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      );
    }
    
    // Verification operation (ML-DSA, SLH-DSA)
    if (isVerification) {
      return (
        <div>
          {/* Basic summary (always shown) */}
          <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
            <div className="font-medium text-secondary-900">Verification Result:</div>
            <div className={`mt-1 p-2 rounded flex items-center ${result.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {result.isValid ? (
                <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg> Valid</>
              ) : (
                <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg> Invalid</>
              )}
            </div>
            {result.executionTime && <div className="mt-2 text-sm text-secondary-800">Time: {result.executionTime}</div>}
          </div>
          
          {/* Preview (not expanded) */}
          {!expanded && (
            <React.Fragment>
              <div className="mb-3 bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                <div className="font-medium text-secondary-900">Message:</div>
                <div className="mt-1 bg-white p-2 rounded border border-secondary-200 text-secondary-900">
                  {result.message || (result.verification && result.verification.message ? result.verification.message as string : '')}
                </div>
              </div>
            </React.Fragment>
          )}
          
          {/* Detailed (expanded) */}
          {expanded && (
            <React.Fragment>
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Used Public Key:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.publicKey || (result.verification && result.verification.publicKey ? result.verification.publicKey as number[] : []), true)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Verified Message:</div>
                <div className="bg-white p-2 rounded border border-secondary-200 text-secondary-900">
                  {result.message || (result.verification && result.verification.message ? result.verification.message as string : '')}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium text-secondary-900 mb-2">Verified Signature:</div>
                <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                  {formatArray(result.signature || (result.verification && result.verification.signature ? result.verification.signature as number[] : []), true)}
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      );
    }
    
    // For any other operations including Complete KEM/DSA flows
    return (
      <div>
        {/* Show basic info for non-expanded view */}
        {!expanded && renderBasicInfo()}
        
        {/* In expanded view, show everything possible */}
        {expanded && (
          <div>
            {renderBasicInfo()}
            
            <div className="mt-6 border-t border-secondary-200 pt-4">
              <div className="font-medium text-secondary-900 mb-4">Full Details:</div>
              
              {/* Available keys */}
              {Boolean(result.publicKey || (result.keyGeneration && typeof result.keyGeneration === 'object' && 'publicKey' in result.keyGeneration)) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Public Key:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(
                      result.publicKey || 
                      (result.keyGeneration && typeof result.keyGeneration === 'object' && 'publicKey' in result.keyGeneration 
                        ? result.keyGeneration.publicKey as number[] 
                        : []), 
                      true)}
                  </div>
                </div>
              )}
              
              {Boolean(result.secretKey || (result.keyGeneration && typeof result.keyGeneration === 'object' && 'secretKey' in result.keyGeneration)) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Secret Key:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(
                      result.secretKey || 
                      (result.keyGeneration && typeof result.keyGeneration === 'object' && 'secretKey' in result.keyGeneration 
                        ? result.keyGeneration.secretKey as number[] 
                        : []), 
                      true)}
                  </div>
                </div>
              )}
              
              {/* Signatures, ciphertexts, shared secrets */}
              {Boolean(
                result.signature || 
                (result.signing && typeof result.signing === 'object' && 'signature' in result.signing) || 
                (result.verification && typeof result.verification === 'object' && 'signature' in result.verification)
              ) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Signature:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(
                      result.signature || 
                      (result.signing && typeof result.signing === 'object' && 'signature' in result.signing
                        ? result.signing.signature as number[] 
                        : (result.verification && typeof result.verification === 'object' && 'signature' in result.verification
                            ? result.verification.signature as number[] 
                            : [])), 
                      true
                    )}
                  </div>
                </div>
              )}
              
              {Boolean(
                result.cipherText || 
                (result.encapsulation && typeof result.encapsulation === 'object' && 'cipherText' in result.encapsulation) || 
                (result.decapsulation && typeof result.decapsulation === 'object' && 'cipherText' in result.decapsulation)
              ) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Cipher Text:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(
                      result.cipherText || 
                      (result.encapsulation && typeof result.encapsulation === 'object' && 'cipherText' in result.encapsulation
                        ? result.encapsulation.cipherText as number[] 
                        : (result.decapsulation && typeof result.decapsulation === 'object' && 'cipherText' in result.decapsulation
                            ? result.decapsulation.cipherText as number[] 
                            : [])), 
                      true
                    )}
                  </div>
                </div>
              )}
              
              {Boolean(
                result.sharedSecret || 
                (result.encapsulation && typeof result.encapsulation === 'object' && 'sharedSecret' in result.encapsulation) || 
                (result.decapsulation && typeof result.decapsulation === 'object' && 'sharedSecret' in result.decapsulation)
              ) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Shared Secret:</div>
                  <div className="bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {formatArray(
                      result.sharedSecret || 
                      (result.encapsulation && typeof result.encapsulation === 'object' && 'sharedSecret' in result.encapsulation
                        ? result.encapsulation.sharedSecret as number[] 
                        : (result.decapsulation && typeof result.decapsulation === 'object' && 'sharedSecret' in result.decapsulation
                            ? result.decapsulation.sharedSecret as number[] 
                            : [])), 
                      true
                    )}
                  </div>
                </div>
              )}

              {Boolean(result.message || (result.signing && typeof result.signing === 'object' && 'message' in result.signing)) && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Message:</div>
                  <div className="bg-white p-2 rounded border border-secondary-200 text-secondary-900">
                    {String(result.message || (result.signing && 'message' in result.signing ? result.signing.message : ''))}
                  </div>
                </div>
              )}
              
              {/* Specific nested data for KEM/DSA operations */}
              {result.keyGeneration && typeof result.keyGeneration === 'object' && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Key Generation Details:</div>
                  <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                    <div className="grid grid-cols-1 gap-2 text-secondary-800">
                      {(typeof result.keyGeneration.publicKeySize === 'number') && (
                        <div className="flex justify-between">
                          <span>Public Key Size:</span>
                          <span className="font-medium">{result.keyGeneration.publicKeySize} bytes</span>
                        </div>
                      )}
                      {(typeof result.keyGeneration.secretKeySize === 'number') && (
                        <div className="flex justify-between">
                          <span>Secret Key Size:</span>
                          <span className="font-medium">{result.keyGeneration.secretKeySize} bytes</span>
                        </div>
                      )}
                      {(typeof result.keyGeneration.executionTime === 'string') && (
                        <div className="flex justify-between">
                          <span>Execution Time:</span>
                          <span className="font-medium">{result.keyGeneration.executionTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {result.encapsulation && typeof result.encapsulation === 'object' && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Encapsulation Details:</div>
                  <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                    <div className="grid grid-cols-1 gap-2 text-secondary-800">
                      {(typeof result.encapsulation.cipherTextSize === 'number') && (
                        <div className="flex justify-between">
                          <span>Cipher Text Size:</span>
                          <span className="font-medium">{result.encapsulation.cipherTextSize} bytes</span>
                        </div>
                      )}
                      {(typeof result.encapsulation.sharedSecretSize === 'number') && (
                        <div className="flex justify-between">
                          <span>Shared Secret Size:</span>
                          <span className="font-medium">{result.encapsulation.sharedSecretSize} bytes</span>
                        </div>
                      )}
                      {(typeof result.encapsulation.executionTime === 'string') && (
                        <div className="flex justify-between">
                          <span>Execution Time:</span>
                          <span className="font-medium">{result.encapsulation.executionTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {result.decapsulation && typeof result.decapsulation === 'object' && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Decapsulation Details:</div>
                  <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                    <div className="grid grid-cols-1 gap-2 text-secondary-800">
                      {(typeof result.decapsulation.secretsMatch === 'boolean') && (
                        <div className="flex justify-between">
                          <span>Secrets Match:</span>
                          <span className={result.decapsulation.secretsMatch ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {result.decapsulation.secretsMatch ? "Yes ✓" : "No ✗"}
                          </span>
                        </div>
                      )}
                      {(typeof result.decapsulation.executionTime === 'string') && (
                        <div className="flex justify-between">
                          <span>Execution Time:</span>
                          <span className="font-medium">{result.decapsulation.executionTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {result.signing && typeof result.signing === 'object' && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Signing Details:</div>
                  <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                    <div className="grid grid-cols-1 gap-2 text-secondary-800">
                      {(typeof result.signing.signatureSize === 'number') && (
                        <div className="flex justify-between">
                          <span>Signature Size:</span>
                          <span className="font-medium">{result.signing.signatureSize} bytes</span>
                        </div>
                      )}
                      {(typeof result.signing.executionTime === 'string') && (
                        <div className="flex justify-between">
                          <span>Execution Time:</span>
                          <span className="font-medium">{result.signing.executionTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {result.verification && typeof result.verification === 'object' && (
                <div className="mt-4">
                  <div className="font-medium text-secondary-900 mb-2">Verification Details:</div>
                  <div className="bg-secondary-50 p-3 rounded-lg border border-secondary-200">
                    <div className="grid grid-cols-1 gap-2 text-secondary-800">
                      {(typeof result.verification.isValid === 'boolean') && (
                        <div className="flex justify-between">
                          <span>Valid Signature:</span>
                          <span className={result.verification.isValid ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {result.verification.isValid ? "Yes ✓" : "No ✗"}
                          </span>
                        </div>
                      )}
                      {(typeof result.verification.executionTime === 'string') && (
                        <div className="flex justify-between">
                          <span>Execution Time:</span>
                          <span className="font-medium">{result.verification.executionTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Debug view only when necessary */}
              <div className="mt-6">
                <details className="text-sm text-secondary-600">
                  <summary className="cursor-pointer hover:text-secondary-800">Show Raw Data Structure</summary>
                  <pre className="mt-2 bg-white p-2 rounded overflow-x-auto border border-secondary-200 font-mono text-xs text-secondary-900">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-secondary-900">{title}</h3>
        <p className="text-secondary-700 mb-6">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-900">Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Operation Type
                </label>
                <select
                  className="select-field text-secondary-900 font-medium"
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                >
                  {operationTypes.map((type) => (
                    <option key={type} value={type} className="text-secondary-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Security Level
                </label>
                <select
                  className="select-field text-secondary-900 font-medium"
                  value={selectedSecurityLevel}
                  onChange={(e) => setSelectedSecurityLevel(e.target.value)}
                >
                  {securityLevels.map((level) => (
                    <option key={level.value} value={level.value} className="text-secondary-900">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Only show message input for non-ML-KEM operations */}
              {!isMLKEM && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Message (optional)
                  </label>
                  <input
                    type="text"
                    className="input-field text-secondary-900 font-medium"
                    placeholder="Enter a message to sign or verify"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              )}
              
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Execute Operation"}
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Result</h3>
              
              {result && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs inline-flex items-center px-2 py-1 border border-secondary-300 rounded-md bg-white text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
                  >
                    {expanded ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Collapse
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Expand
                      </>
                    )}
                  </button>
                  
                  <button 
                    id="copy-button"
                    onClick={copyResultToClipboard}
                    className="text-xs inline-flex items-center px-2 py-1 border border-secondary-300 rounded-md bg-white text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </button>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
            
            {result && (
              <div ref={resultRef} className="mt-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                {renderFormattedResult(result, expanded)}
              </div>
            )}
            
            {!result && !error && !isLoading && (
              <div className="mt-4 p-8 flex flex-col items-center justify-center bg-secondary-50 border border-dashed border-secondary-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-secondary-800 text-center">Select parameters and execute an operation to see results</p>
              </div>
            )}
            
            {isLoading && (
              <div className="mt-4 p-8 flex flex-col items-center justify-center bg-secondary-50 border border-dashed border-secondary-200 rounded-lg">
                <svg className="animate-spin h-10 w-10 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-secondary-800">Processing your request...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 