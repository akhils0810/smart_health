import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Male',
        height: '',
        weight: '',
    });

    const { name, email, password, age, gender, height, weight } = formData;
    const { register, user } = useContext(AuthContext);
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

        // Basic validation
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard');
            toast.success('Registration successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className='min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='glass-card w-full max-w-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden'
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>

                <h1 className='text-4xl font-extrabold text-center mb-2 text-gray-800'>Create Account</h1>
                <p className='text-center text-gray-500 mb-8'>Join us to start your healthy lifestyle</p>

                <form onSubmit={onSubmit} className='space-y-6'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaUser />
                                </div>
                                <input
                                    type='text'
                                    className='glass-input w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none'
                                    id='name'
                                    name='name'
                                    value={name}
                                    placeholder='John Doe'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Email</label>
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
                                    placeholder='john@example.com'
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
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
                                placeholder='••••••••'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Age</label>
                            <input
                                type='number'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                name='age'
                                value={age}
                                placeholder='25'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Gender</label>
                            <select
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none bg-white'
                                name='gender'
                                value={gender}
                                onChange={onChange}
                            >
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Height (cm)</label>
                            <input
                                type='number'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                name='height'
                                value={height}
                                placeholder='175'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Weight (kg)</label>
                            <input
                                type='number'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                name='weight'
                                value={weight}
                                placeholder='70'
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        className='w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-4'
                    >
                        Register
                    </motion.button>
                </form>

                <p className='mt-6 text-center text-gray-600'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-blue-600 font-bold hover:underline'>
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
