import React from 'react';
import { Shield, Linkedin, Github, Mail } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Footer = () => {
    const { navigateTo } = useApp();

    const sections = [
        {
            title: 'Services',
            links: [
                { label: 'Cleaning', view: 'services' },
                { label: 'Plumbing', view: 'services' },
                { label: 'Electrical', view: 'services' },
                { label: 'Gardening', view: 'services' },
                { label: 'Beauty', view: 'services' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', view: 'about' },
                { label: 'Founder', view: 'founder' },
                { label: 'Collaboration', view: 'collaboration' },
                { label: 'Open Source', view: 'opensource' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', view: 'privacy' },
                { label: 'Terms of Service', view: 'terms' },
            ],
        },
    ];

    return (
        <footer className="bg-gray-950 text-gray-400 pt-12 pb-6 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-3 text-white">
                            <Shield size={22} fill="white" className="text-indigo-500" />
                            <span className="font-bold text-xl">Lend a Hand</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs mb-4">
                            Connecting you with trusted local professionals for all your home service needs.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-800 rounded-lg transition-colors hover:text-white" aria-label="LinkedIn">
                                <Linkedin size={16} />
                            </a>
                            <a href="https://github.com/Siddarthva/Lend-A-Hand" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-800 rounded-lg transition-colors hover:text-white" aria-label="GitHub">
                                <Github size={16} />
                            </a>
                            <a href="mailto:hello@lendahand.com" className="p-2 hover:bg-gray-800 rounded-lg transition-colors hover:text-white" aria-label="Email">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    {sections.map(section => (
                        <div key={section.title}>
                            <h4 className="text-white font-semibold text-sm mb-4">{section.title}</h4>
                            <ul className="space-y-2.5">
                                {section.links.map(link => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => navigateTo(link.view)}
                                            className="text-sm hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs">© {new Date().getFullYear()} Lend a Hand. Portfolio/MVP project — demo data only.</p>
                    <p className="text-xs">Built with ❤️ by <button onClick={() => navigateTo('founder')} className="hover:text-white transition-colors underline underline-offset-2">Siddarth V Acharya</button></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
