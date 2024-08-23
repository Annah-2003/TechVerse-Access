// components/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">
            TechVerse
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/events">
            <a className="hover:underline">Events</a>
          </Link>
          <Link href="/communities">
            <a className="hover:underline">Communities</a>
          </Link>
          <Link href="/profile">
            <a className="hover:underline">Profile</a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
