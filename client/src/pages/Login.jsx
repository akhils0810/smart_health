import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = { email, password };
            await login(userData);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='min-h-[calc(100vh-80px)] flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className='glass-card w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden'
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                <h1 className='text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600'>Welcome Back</h1>
                <p className='text-center text-gray-500 mb-8'>Sign in to track your health journey</p>

                <form onSubmit={onSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaEnvelope />
                            </div>
                            <input
                                type='email'
                                className='glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Enter your email'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaLock />
                            </div>
                            <input
                                type='password'
                                className='glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none'
                                id='password'
                                name='password'
                                value={password}
                                placeholder='Enter your password'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
                    >
                        Sign In
                    </motion.button>
                </form>

                <p className='mt-8 text-center text-gray-600'>
                    Don't have an account?{' '}
                    <Link to='/register' className='text-blue-600 font-bold hover:underline'>
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
