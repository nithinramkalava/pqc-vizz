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
  
  // Get color classes based on the color scheme
  const getNavbarBgClass = () => {
    switch (colorScheme) {
      case 'accent':
        return 'bg-accent-700';
      case 'secondary':
        return 'bg-secondary-700';
      default:
        return 'bg-primary-700';
    }
  };
  
  const getNavLinkClass = (path: string) => {
    const baseClass = "py-2 px-3 rounded-md transition-colors";
    const isActivePath = isActive(path);
    
    switch (colorScheme) {
      case 'accent':
        return `${baseClass} ${isActivePath ? 'bg-accent-600 text-white' : 'text-white/80 hover:bg-accent-600/50 hover:text-white'}`;
      case 'secondary':
        return `${baseClass} ${isActivePath ? 'bg-secondary-600 text-white' : 'text-white/80 hover:bg-secondary-600/50 hover:text-white'}`;
      default:
        return `${baseClass} ${isActivePath ? 'bg-primary-600 text-white' : 'text-white/80 hover:bg-primary-600/50 hover:text-white'}`;
    }
  };

  return (
    <header className={`${getNavbarBgClass()} text-white shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold">PQC Visualization</Link>
          </div>
          <nav className="flex space-x-1">
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