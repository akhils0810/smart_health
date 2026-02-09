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
        { path: '/profile', label: 'Profile', icon: <FaUser className='mr-1' /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className='sticky top-0 z-50 glass transition-all duration-300'>
            <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
                <Link to='/' className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-80 transition-opacity'>
                    HealthTracker
                </Link>

                {/* Desktop Nav */}
                <nav className='hidden md:flex items-center space-x-8'>
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-500'
                                        }`}
                                >
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-blue-50 rounded-md -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="flex items-center">{link.icon}{link.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={onLogout}
                                className='flex items-center bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium'
                            >
                                <FaSignOutAlt className='mr-2' /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to='/login' className='text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors'>
                                Login
                            </Link>
                            <Link
                                to='/register'
                                className='bg-blue-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition-all hover:shadow-lg font-medium'
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className='md:hidden text-gray-600 focus:outline-none'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='md:hidden bg-white border-t border-gray-100 overflow-hidden'
                    >
                        <nav className='flex flex-col p-4 space-y-4'>
                            {user ? (
                                <>
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center px-4 py-3 rounded-lg ${isActive(link.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {link.icon}{link.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={onLogout}
                                        className='flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg'
                                    >
                                        <FaSignOutAlt className='mr-2' /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to='/login' onClick={() => setIsOpen(false)} className='block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg'>
                                        Login
                                    </Link>
                                    <Link to='/register' onClick={() => setIsOpen(false)} className='block px-4 py-3 bg-blue-600 text-white rounded-lg text-center shadow'>
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
