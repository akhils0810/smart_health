import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaRuler, FaWeight, FaVenusMars, FaBirthdayCake, FaEnvelope, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: user?.age || '',
        gender: user?.gender || 'Male',
        height: user?.height || '',
        weight: user?.weight || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.put('http://localhost:5001/api/auth/profile', formData, config);

            localStorage.setItem('user', JSON.stringify(response.data));
            toast.success('Profile updated successfully');
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    const InfoItem = ({ icon, label, value }) => (
        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="p-3 bg-white rounded-full text-blue-500 shadow-sm mr-4">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className='container mx-auto px-6 py-12'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='max-w-4xl mx-auto glass-card rounded-3xl overflow-hidden shadow-2xl'
            >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                <FaUserCircle size={120} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-8 px-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-800">{user?.name}</h1>
                    <p className="text-gray-500">{user?.email}</p>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='mt-6 px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-bold hover:bg-blue-200 transition-colors inline-flex items-center'
                        >
                            <FaEdit className='mr-2' /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="px-8 pb-12">
                    {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InfoItem icon={<FaBirthdayCake />} label="Age" value={`${user?.age} years`} />
                            <InfoItem icon={<FaVenusMars />} label="Gender" value={user?.gender} />
                            <InfoItem icon={<FaRuler />} label="Height" value={`${user?.height} cm`} />
                            <InfoItem icon={<FaWeight />} label="Weight" value={`${user?.weight} kg`} />
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleUpdate}
                            className='mt-4 max-w-2xl mx-auto space-y-6'
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaUser />
                                        </div>
                                        <input type='text' name='name' value={formData.name} onChange={handleChange} className='glass-input w-full pl-10 pr-4 py-3 rounded-xl' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FaEnvelope />
                                        </div>
                                        <input type='email' name='email' value={formData.email} onChange={handleChange} className='glass-input w-full pl-10 pr-4 py-3 rounded-xl' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Age</label>
                                    <input type='number' name='age' value={formData.age} onChange={handleChange} className='glass-input w-full px-4 py-3 rounded-xl' />
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Gender</label>
                                    <select name='gender' value={formData.gender} onChange={handleChange} className='glass-input w-full px-4 py-3 rounded-xl bg-white'>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Height (cm)</label>
                                    <input type='number' name='height' value={formData.height} onChange={handleChange} className='glass-input w-full px-4 py-3 rounded-xl' />
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>Weight (kg)</label>
                                    <input type='number' name='weight' value={formData.weight} onChange={handleChange} className='glass-input w-full px-4 py-3 rounded-xl' />
                                </div>
                            </div>

                            <div className='flex justify-end space-x-4 pt-4'>
                                <button
                                    type='button'
                                    onClick={() => setIsEditing(false)}
                                    className='px-6 py-2 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 flex items-center transition-colors'
                                >
                                    <FaTimes className='mr-2' /> Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg flex items-center transition-all'
                                >
                                    <FaSave className='mr-2' /> Save Changes
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
