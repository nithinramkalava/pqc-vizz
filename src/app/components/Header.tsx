'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  colorScheme?: 'primary' | 'accent' | 'secondary';
};

export default function Header({ colorScheme = 'primary' }: HeaderProps) {
  const pathname = usePathname();
  
  // Determine the active path
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // Get color classes based on the color scheme - setting it to transparent
  const getNavbarBgClass = () => {
    return 'bg-transparent';
  };
  
  const getNavLinkClass = (path: string) => {
    const baseClass = "py-2 px-3 rounded-md transition-colors drop-shadow-md";
    const isActivePath = isActive(path);
    
    switch (colorScheme) {
      case 'accent':
        return `${baseClass} ${isActivePath ? 'text-white font-semibold tracking-wide' : 'text-white/90 hover:text-white'}`;
      case 'secondary':
        return `${baseClass} ${isActivePath ? 'text-white font-semibold tracking-wide' : 'text-white/90 hover:text-white'}`;
      default:
        return `${baseClass} ${isActivePath ? 'text-white font-semibold tracking-wide' : 'text-white/90 hover:text-white'}`;
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold transition-all duration-300 drop-shadow-md">
              <span className="text-white font-extrabold">PQC</span>
              <span className="ml-1 text-white">Visualization</span>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link href="/" className={getNavLinkClass('/')}>
              Home
            </Link>
            <Link href="/ml-kem" className={getNavLinkClass('/ml-kem')}>
              ML-KEM
            </Link>
            <Link href="/ml-dsa" className={getNavLinkClass('/ml-dsa')}>
              ML-DSA
            </Link>
            <Link href="/slh-dsa" className={getNavLinkClass('/slh-dsa')}>
              SLH-DSA
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 