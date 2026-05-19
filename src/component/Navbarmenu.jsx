import React, { useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/picture/Logo.png';
import Slogan from '../assets/picture/slogan.png';
import { usersInfo } from '../assets/usersInfo';
import { UserContext } from '../context/userContext/UserContext';

const Navbarmenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const {myUserInfo}=useContext(UserContext);
console.log(myUserInfo);
  return (
    <header className="bg-primary text-neutral shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        {/* Logo Container */}
        <div className="relative w-36 h-12 flex items-center">
          <Link to="/" className="absolute -top-4 left-0 z-50 transition-transform hover:scale-105">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-37 w-auto max-w-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" 
            />
          </Link>
        </div>

        {/* Slogan Image - Center */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <img 
            src={Slogan} 
            alt="เพราะเราไม่ล้อเล่นเรื่องไก่ทอด" 
            className="h-17 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-secondary transition duration-300">Home</Link></li>
            <li><Link to="/menu" className="hover:text-secondary transition duration-300">Menu</Link></li>
            <li><Link to="/order" className="hover:text-secondary transition duration-300">Order</Link></li>
            <li><Link to="#" className="hover:text-secondary transition duration-300">Contact</Link></li>
          </ul>
          <button className="bg-secondary hover:bg-accent text-neutral px-6 py-2 rounded-full font-semibold transition duration-300">
            <Link to="/login">{`${!usersInfo?" Sign In":"Account"}`}</Link>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-neutral focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-primary border-t border-accent/20`}>
        <ul className="flex flex-col p-4 space-y-4">
          <li><Link to="/" className="block hover:text-secondary transition duration-300">Home</Link></li>
          <li><Link to="/menu" className="block hover:text-secondary transition duration-300">Menu</Link></li>
          <li><Link to="/order" className="block hover:text-secondary transition duration-300">Order</Link></li>
          <li><Link to="#" className="block hover:text-secondary transition duration-300">Contact</Link></li>
          <li>
            <button className="w-full bg-secondary hover:bg-accent text-neutral px-6 py-2 rounded-lg font-semibold transition duration-300">
              <Link to="/login">{`${!myUserInfo?" Sign In":"Account"}`}</Link>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbarmenu;
