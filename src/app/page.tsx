import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary-700 to-primary-900 z-0"></div>
      <Header />
      <main className="flex-grow relative z-1">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16 pt-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Post-Quantum Cryptography Visualization</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Explore NIST&apos;s standardized post-quantum cryptographic algorithms designed to resist
                attacks from both classical and quantum computers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/ml-kem" 
                  className="bg-white text-primary-800 hover:bg-primary-100 font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Explore Algorithms
                </Link>
                <a 
                  href="https://csrc.nist.gov/Projects/post-quantum-cryptography" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-transparent border border-white text-white hover:bg-white/10 font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Algorithm cards - redesigned with equal heights and aligned buttons */}
        <section className="py-16 bg-secondary-50">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-secondary-900">Quantum-Resistant Algorithms</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* ML-KEM Card */}
              <div className="card hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
                <div className="h-2 bg-primary-600 rounded-t-xl"></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-auto">
                    <h3 className="text-2xl font-semibold mb-2 text-primary-800">ML-KEM</h3>
                    <div className="text-xs inline-block px-2 py-1 bg-primary-100 text-primary-800 rounded-full mb-4">
                      FIPS 203
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Multi-Lattice Key Encapsulation Mechanism for secure key exchange resistant to quantum attacks.
                    </p>
                    <p className="text-secondary-800 mb-6">
                      Based on the hardness of lattice problems, specifically the Module Learning With Errors problem.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link href="/ml-kem" className="btn-primary inline-flex items-center justify-center w-full">
                      Explore ML-KEM
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ML-DSA Card */}
              <div className="card hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
                <div className="h-2 bg-accent-600 rounded-t-xl"></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-auto">
                    <h3 className="text-2xl font-semibold mb-2 text-accent-800">ML-DSA</h3>
                    <div className="text-xs inline-block px-2 py-1 bg-accent-100 text-accent-800 rounded-full mb-4">
                      FIPS 204
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Multi-Lattice Digital Signature Algorithm for quantum-resistant document and data signing.
                    </p>
                    <p className="text-secondary-800 mb-6">
                      Based on lattice problems (MLWE and MSIS) for cryptographic signatures that withstand quantum attacks.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link href="/ml-dsa" className="bg-accent-600 hover:bg-accent-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center w-full">
                      Explore ML-DSA
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* SLH-DSA Card */}
              <div className="card hover:translate-y-[-4px] transition-all duration-300 flex flex-col">
                <div className="h-2 bg-secondary-600 rounded-t-xl"></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-auto">
                    <h3 className="text-2xl font-semibold mb-2 text-secondary-800">SLH-DSA</h3>
                    <div className="text-xs inline-block px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full mb-4">
                      FIPS 205
                    </div>
                    <p className="text-secondary-800 mb-4">
                      Stateless Hash-based Digital Signature Algorithm with minimal security assumptions.
                    </p>
                    <p className="text-secondary-800 mb-6">
                      Relies solely on the security of cryptographic hash functions, making it a conservative choice.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link href="/slh-dsa" className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center w-full">
                      Explore SLH-DSA
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why PQC section with improved text contrast */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-secondary-900">Why Post-Quantum Cryptography?</h2>
            
            <div className="card p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-4 text-secondary-900">Securing the Future of Digital Communication</h3>
                  <p className="text-secondary-900 mb-3">
                    Current public-key cryptography (like RSA and ECC) will become vulnerable to attacks by large-scale
                    quantum computers. Post-quantum cryptography provides algorithms that remain secure against both
                    classical and quantum computing threats.
                  </p>
                  <p className="text-secondary-900">
                    NIST has standardized these algorithms to prepare for the transition to quantum-resistant
                    cryptographic systems that will secure our digital infrastructure for the future.
                  </p>
                </div>
                <div className="bg-primary-700 text-white p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-4">Quantum Computing Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-primary-200">Present Day</h4>
                        <p className="text-sm text-primary-100">Early quantum computers with limited qubits</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-primary-200">Next 5-10 Years</h4>
                        <p className="text-sm text-primary-100">Advancement of quantum computing technology</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <svg className="h-6 w-6 text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-primary-200">Future Threat</h4>
                        <p className="text-sm text-primary-100">Large-scale quantum computers could break RSA/ECC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
