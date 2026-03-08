import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const onLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/activity', label: 'Activity' },
        { path: '/diet', label: 'Diet' },
        { path: '/health', label: 'Health' },
        { path: '/profile', label: 'Profile', icon: <FaUser className='mr-1' /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className='sticky top-6 z-50 px-6'>
            <div className='container mx-auto glass rounded-2xl py-3 px-8 flex justify-between items-center transition-all duration-300 border-black/5'>
                <Link to='/' className='flex items-center space-x-3 group'>
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/20"
                    >
                        <span className="text-white text-xl font-black italic">S</span>
                    </motion.div>
                    <span className='text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors'>
                        Smart<span className="text-indigo-600">Tracker</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className='hidden md:flex items-center space-x-2'>
                    {user ? (
                        <>
                            <div className="flex items-center space-x-1 mr-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(link.path)
                                            ? 'text-indigo-700'
                                            : 'text-slate-600 hover:text-indigo-600'
                                            }`}
                                    >
                                        {isActive(link.path) && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-black/5 rounded-xl border border-black/5 -z-10"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                        <span className="flex items-center">{link.icon}{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="h-6 w-[1px] bg-black/10 mx-2" />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onLogout}
                                className='flex items-center bg-black/5 hover:bg-red-50 text-slate-900 px-5 py-2.5 rounded-xl border border-black/5 hover:border-red-200 transition-all duration-300 text-sm font-bold group'
                            >
                                <FaSignOutAlt className='mr-2 text-red-500 group-hover:scale-110 transition-transform' /> Logout
                            </motion.button>
                        </>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to='/login' className='text-slate-600 hover:text-slate-900 font-bold px-4 py-2.5 transition-colors'>
                                Login
                            </Link>
                            <Link
                                to='/register'
                                className='bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all font-bold'
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className='md:hidden text-slate-900 hover:text-indigo-600 transition-colors focus:outline-none'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className='md:hidden mt-4'
                    >
                        <nav className='glass p-4 rounded-2xl flex flex-col space-y-2 border-black/5'>
                            {user ? (
                                <>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center px-4 py-3 rounded-xl font-bold ${isActive(link.path)
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                : 'text-slate-600 hover:bg-black/5'
                                                }`}
                                        >
                                            {link.icon || <div className="w-1 h-1 rounded-full bg-current mr-3" />}{link.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={onLogout}
                                        className='flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold'
                                    >
                                        <FaSignOutAlt className='mr-3' /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to='/login' onClick={() => setIsOpen(false)} className='block px-4 py-3 text-slate-600 hover:bg-black/5 rounded-xl font-bold'>
                                        Login
                                    </Link>
                                    <Link to='/register' onClick={() => setIsOpen(false)} className='block px-4 py-3 bg-indigo-600 text-white rounded-xl text-center font-bold shadow-lg shadow-indigo-500/20'>
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
