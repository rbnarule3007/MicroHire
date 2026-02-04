import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    const isActive = (path) => {
        return location.pathname === path ? "text-purple-600 font-semibold" : "text-gray-600 hover:text-purple-600";
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2 rounded-lg text-white group-hover:shadow-lg transition-all duration-300">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                            MicroHire
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            <Link to="/" className={`text-sm transition-colors duration-200 ${isActive('/')}`}>
                                Home
                            </Link>
                            <Link to="/about" className={`text-sm transition-colors duration-200 ${isActive('/about')}`}>
                                About
                            </Link>
                            <Link to="/contact" className={`text-sm transition-colors duration-200 ${isActive('/contact')}`}>
                                Contact
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                                Log In
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                                Sign Up
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/" className={`block py-2 text-base ${isActive('/')}`} onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link to="/about" className={`block py-2 text-base ${isActive('/about')}`} onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link to="/contact" className={`block py-2 text-base ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>
                        Contact
                    </Link>
                    <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                        <Button variant="ghost" fullWidth onClick={() => { setIsOpen(false); navigate('/login'); }}>
                            Log In
                        </Button>
                        <Button variant="primary" fullWidth onClick={() => { setIsOpen(false); navigate('/signup'); }}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
