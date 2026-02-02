import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-1.5 rounded text-white">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xl font-bold">MicroHire</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Connecting talented professionals with smart businesses. No bidding, just results.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Platform</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><Link to="/" className="hover:text-purple-400 transition-colors">How it works</Link></li>
                            <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><Link to="#" className="hover:text-purple-400 transition-colors">Hire Developers</Link></li>
                            <li><Link to="#" className="hover:text-purple-400 transition-colors">Hire Designers</Link></li>
                            <li><Link to="#" className="hover:text-purple-400 transition-colors">Hire Marketers</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-purple-600 transition-colors text-slate-400 hover:text-white">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-purple-600 transition-colors text-slate-400 hover:text-white">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-purple-600 transition-colors text-slate-400 hover:text-white">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2026 MicroHire. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-slate-500 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
