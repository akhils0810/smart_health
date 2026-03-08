import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaWeight, FaRulerVertical, FaHeartbeat, FaChartLine, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthMetrics = () => {
    const [metrics, setMetrics] = useState([]);
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
        systolic: '',
        diastolic: '',
        heartRate: ''
    });

    const { user } = useContext(AuthContext);

    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/health-metrics', config);
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchMetrics();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                weight: Number(formData.weight),
                height: Number(formData.height),
                bloodPressure: {
                    systolic: Number(formData.systolic),
                    diastolic: Number(formData.diastolic)
                },
                heartRate: Number(formData.heartRate)
            };
            const response = await axios.post('http://localhost:5001/api/health-metrics', payload, config);
            setMetrics([response.data, ...metrics]);
            setFormData({ weight: '', height: '', systolic: '', diastolic: '', heartRate: '' });
            toast.success('Metrics updated successfully');
        } catch (error) {
            console.error('Error updating metrics:', error);
            toast.error('Failed to update metrics');
        }
    };

    const chartData = [...metrics].reverse().map(m => ({
        date: new Date(m.date).toLocaleDateString(),
        weight: m.weight,
        bmi: m.bmi
    }));

    return (
        <div className='container mx-auto px-6'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center mb-10'
            >
                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl mr-5 shadow-inner border border-blue-500/20">
                    <FaHeartbeat size={24} />
                </div>
                <div>
                    <h1 className='text-4xl font-black text-slate-900 tracking-tight uppercase'>Vitals & Metrics</h1>
                    <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">Precision Health Tuning</p>
                </div>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='glass-card p-10 rounded-[2.5rem] h-fit sticky top-28'
                >
                    <h2 className='text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter'>Log Vitals</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Weight (kg)</label>
                                <input
                                    type='number'
                                    name='weight'
                                    className='glass-input w-full px-5 py-4 rounded-2xl'
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Height (cm)</label>
                                <input
                                    type='number'
                                    name='height'
                                    className='glass-input w-full px-5 py-4 rounded-2xl'
                                    value={formData.height}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Systolic</label>
                                <input
                                    type='number'
                                    name='systolic'
                                    className='glass-input w-full px-5 py-4 rounded-2xl'
                                    value={formData.systolic}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Diastolic</label>
                                <input
                                    type='number'
                                    name='diastolic'
                                    className='glass-input w-full px-5 py-4 rounded-2xl'
                                    value={formData.diastolic}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Pulse (bpm)</label>
                            <input
                                type='number'
                                name='heartRate'
                                className='glass-input w-full px-5 py-4 rounded-2xl'
                                value={formData.heartRate}
                                onChange={handleChange}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/10 transition-all uppercase tracking-widest mt-4'
                        >
                            Sync Metrics
                        </motion.button>
                    </form>
                </motion.div>

                <div className='lg:col-span-2 space-y-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='glass-card p-10 rounded-[2.5rem] h-[400px]'
                    >
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 flex items-center">
                            <FaChartLine className="mr-3 text-blue-600" /> Progression Analysis
                        </h3>
                        <div style={{ width: '100%', height: '80%' }}>
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} domain={['dataMin - 2', 'dataMax + 2']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {metrics.map((m, index) => (
                                <motion.div
                                    key={m._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='glass-card p-6 rounded-3xl relative group overflow-hidden'
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-blue-500 opacity-5 group-hover:scale-150 transition-transform duration-700" />
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-black/5 p-3 rounded-2xl text-blue-600 border border-black/5 group-hover:border-blue-500/30 transition-colors">
                                            <FaWeight size={20} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{new Date(m.date).toLocaleDateString()}</p>
                                            <div className="flex items-center justify-end mt-1">
                                                <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full tracking-widest">BMI {m.bmi}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-black/5 p-3 rounded-2xl text-center">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Mass</p>
                                            <p className="text-lg font-black text-slate-900">{m.weight}kg</p>
                                        </div>
                                        <div className="bg-black/5 p-3 rounded-2xl text-center border-x border-black/5">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">BP</p>
                                            <p className="text-lg font-black text-slate-900">{m.bloodPressure?.systolic || '--'}/{m.bloodPressure?.diastolic || '--'}</p>
                                        </div>
                                        <div className="bg-black/5 p-3 rounded-2xl text-center">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Pulse</p>
                                            <p className="text-lg font-black text-slate-900">{m.heartRate || '--'}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMetrics;
