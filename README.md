# PQC Visualization

A comprehensive visualization and exploration tool for NIST's post-quantum cryptographic standards. This project provides interactive demonstrations and educational resources for understanding quantum-resistant cryptographic algorithms.

## 🔗 Live Demo

**Website:** [https://pqc-vizz.vercel.app/](https://pqc-vizz.vercel.app/)

## 📖 About

This application was developed as a major project for a BTech Computer Science degree at Vasireddy Venkatadri Institute of Technology, India. It aims to help developers understand and visualize post-quantum cryptographic algorithms to prepare for the quantum computing era.

### Features

- Interactive visualizations of all three NIST standardized post-quantum algorithms
- Performance benchmarks and comparison
- Educational content explaining algorithm functionality
- Code examples and implementation details

## 📦 NPM Package

The core cryptographic implementations are available as an NPM package:

- **Package:** [pqc](https://www.npmjs.com/package/pqc)
- **Implementation:** Pure JavaScript with no native dependencies
- **Algorithms:** ML-KEM, ML-DSA, and SLH-DSA

### Performance

| Algorithm | Operation | Performance |
|-----------|-----------|-------------|
| ML-KEM-768 | Key Generation | 2,305 op/s |
| ML-DSA65 | Sign | 120 op/s |
| SLH-DSA-SHA2-128f | Sign | 90ms |

## 🧪 Research Paper

This project is accompanied by a research paper titled "Post-Quantum Security for Web Applications" that details the implementation approach and performance benchmarks.

## 💻 Technologies

- **Frontend:** Next.js, React, TailwindCSS
- **Cryptography:** JavaScript implementation of NIST FIPS 203, 204, and 205
- **Deployment:** Vercel

## 📝 Author

**Nithin Ram Kalava**  
Email: contact@nithinram.com

## 📚 References

- [NIST FIPS 203](https://doi.org/10.6028/NIST.FIPS.203) - Module-Lattice-Based Key-Encapsulation Mechanism Standard
- [NIST FIPS 204](https://doi.org/10.6028/NIST.FIPS.204) - Module-Lattice-Based Digital Signature Standard
- [NIST FIPS 205](https://doi.org/10.6028/NIST.FIPS.205) - Stateless Hash-Based Digital Signature Standard
