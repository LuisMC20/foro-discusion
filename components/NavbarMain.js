import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavbarMain() {
  const router = useRouter();

  const linkClass = (path) => 
    `hover:bg-gray-700 px-3 py-2 rounded ${router.pathname === path ? 'bg-gray-900' : ''}`;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link href="/" className={linkClass('/')}>
          Home
        </Link>
        <Link href="/publicaciones" className={linkClass('/publicaciones')}>
          Publicaciones
        </Link>
        <Link href="/MisPublicaciones" className={linkClass('/mis-publicaciones')}>
          Mis Publicaciones
        </Link>
      </div>
    </nav>
  );
}
