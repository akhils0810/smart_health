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
        <div className="flex items-center p-5 bg-black/5 rounded-2xl border border-black/5 group hover:border-blue-500/30 transition-all">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 mr-5 shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{label}</p>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{value}</p>
            </div>
        </div>
    );

    return (
        <div className='container mx-auto px-6 py-10'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-4xl mx-auto glass-card rounded-[2.5rem] overflow-hidden'
            >
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 h-48 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                        <div className="w-40 h-40 glass p-2 rounded-full shadow-2xl relative z-10">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden border-4 border-black/10">
                                <FaUserCircle size={160} className="opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-24 pb-10 px-10 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{user?.name}</h1>
                    <p className="text-blue-600/60 font-bold tracking-widest uppercase text-xs mt-2">{user?.email}</p>

                    {!isEditing && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(true)}
                            className='mt-8 px-8 py-3 bg-black/5 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/10 transition-all border border-black/10 flex items-center mx-auto'
                        >
                            <FaEdit className='mr-2' /> Edit Identity
                        </motion.button>
                    )}
                </div>

                <div className="px-10 pb-16">
                    {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem icon={<FaBirthdayCake />} label="Biological Age" value={`${user?.age} Years`} />
                            <InfoItem icon={<FaVenusMars />} label="Gender Identity" value={user?.gender} />
                            <InfoItem icon={<FaRuler />} label="Physical Height" value={`${user?.height} CM`} />
                            <InfoItem icon={<FaWeight />} label="Current Weight" value={`${user?.weight} KG`} />
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleUpdate}
                            className='space-y-8 max-w-2xl mx-auto'
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500/50">
                                            <FaUser />
                                        </div>
                                        <input type='text' name='name' value={formData.name} onChange={handleChange} className='glass-input w-full pl-12 pr-4 py-4 rounded-2xl' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Email Protocol</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500/50">
                                            <FaEnvelope />
                                        </div>
                                        <input type='email' name='email' value={formData.email} onChange={handleChange} className='glass-input w-full pl-12 pr-4 py-4 rounded-2xl' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Age</label>
                                    <input type='number' name='age' value={formData.age} onChange={handleChange} className='glass-input w-full px-5 py-4 rounded-2xl' />
                                </div>
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Gender</label>
                                    <select name='gender' value={formData.gender} onChange={handleChange} className='glass-input w-full px-5 py-4 rounded-2xl appearance-none cursor-pointer'>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Height (cm)</label>
                                    <input type='number' name='height' value={formData.height} onChange={handleChange} className='glass-input w-full px-5 py-4 rounded-2xl' />
                                </div>
                                <div>
                                    <label className='block text-slate-600 text-[10px] font-black mb-3 uppercase tracking-widest'>Weight (kg)</label>
                                    <input type='number' name='weight' value={formData.weight} onChange={handleChange} className='glass-input w-full px-5 py-4 rounded-2xl' />
                                </div>
                            </div>

                            <div className='flex justify-end space-x-6 pt-6'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type='button'
                                    onClick={() => setIsEditing(false)}
                                    className='px-8 py-4 bg-black/5 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs border border-black/5 hover:bg-black/10'
                                >
                                    Abort
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    type='submit'
                                    className='px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all'
                                >
                                    Synchronize
                                </motion.button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
