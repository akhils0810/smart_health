import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaRunning, FaFire, FaClock, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [formData, setFormData] = useState({
        activityType: 'Running',
        duration: '',
        caloriesBurned: ''
    });

    // Stats
    const [totalBurned, setTotalBurned] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [trendData, setTrendData] = useState([]);

    const { user } = useContext(AuthContext);

    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/activities', config);
            setActivities(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const calculateStats = (data) => {
        const burned = data.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
        const duration = data.reduce((acc, curr) => acc + curr.duration, 0);
        setTotalBurned(burned);
        setTotalDuration(duration);

        // Chart Data: Calories by Type
        const typeStats = {};
        data.forEach(act => {
            if (typeStats[act.activityType]) {
                typeStats[act.activityType] += act.caloriesBurned;
            } else {
                typeStats[act.activityType] = act.caloriesBurned;
            }
        });

        const newChartData = Object.keys(typeStats).map(key => ({
            name: key,
            calories: typeStats[key]
        }));
        setChartData(newChartData);

        // Trend Data: Last 7 Days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        const newTrendData = last7Days.map(date => {
            const dayBurned = data
                .filter(act => act.date.startsWith(date))
                .reduce((acc, curr) => acc + curr.caloriesBurned, 0);
            return { name: date.slice(5), calories: dayBurned };
        });
        setTrendData(newTrendData);
    };

    useEffect(() => {
        if (user && user.token) {
            fetchActivities();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/activities', formData, config);
            const updatedActivities = [response.data, ...activities];
            setActivities(updatedActivities);
            calculateStats(updatedActivities);
            setFormData({ activityType: 'Running', duration: '', caloriesBurned: '' });
            toast.success('Activity added successfully');
        } catch (error) {
            console.error('Error adding activity:', error);
            toast.error('Failed to add activity');
        }
    };

    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8'];

    return (
        <div className='container mx-auto px-6'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center mb-10'
            >
                <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl mr-5 shadow-inner border border-rose-500/20">
                    <FaRunning size={24} />
                </div>
                <div>
                    <h1 className='text-4xl font-black text-slate-900 tracking-tight uppercase'>Activity Tracker</h1>
                    <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">Every move counts</p>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-[2rem] border-l-[6px] border-rose-500 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-rose-500 opacity-5 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Total Burned</p>
                            <p className="text-3xl font-black text-slate-900">{totalBurned} <span className="text-xs font-medium text-slate-500">KCAL</span></p>
                        </div>
                        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                            <FaFire size={24} />
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-[2rem] border-l-[6px] border-indigo-500 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-indigo-500 opacity-5 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Total Duration</p>
                            <p className="text-3xl font-black text-slate-900">{totalDuration} <span className="text-xs font-medium text-slate-500">MIN</span></p>
                        </div>
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                            <FaClock size={24} />
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-[2rem] border-l-[6px] border-emerald-500 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-emerald-500 opacity-5 group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Success Rate</p>
                            <p className="text-3xl font-black text-slate-900">{activities.length} <span className="text-xs font-medium text-slate-500">DAYS</span></p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                            <FaTrophy size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='glass-card p-10 rounded-[2.5rem] h-fit sticky top-28'
                >
                    <h2 className='text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter'>Journal Workout</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Modality</label>
                            <select
                                name='activityType'
                                className='glass-input w-full px-5 py-4 rounded-2xl appearance-none cursor-pointer'
                                value={formData.activityType}
                                onChange={handleChange}
                            >
                                <option value='Running'>Running</option>
                                <option value='Cycling'>Cycling</option>
                                <option value='Gym'>Gym</option>
                                <option value='Swimming'>Swimming</option>
                                <option value='Yoga'>Yoga</option>
                                <option value='Walking'>Walking</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Duration (minutes)</label>
                            <input
                                type='number'
                                name='duration'
                                className='glass-input w-full px-5 py-4 rounded-2xl'
                                placeholder='30'
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Energy Spent (kcal)</label>
                            <input
                                type='number'
                                name='caloriesBurned'
                                className='glass-input w-full px-5 py-4 rounded-2xl'
                                value={formData.caloriesBurned}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(244, 63, 94, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-500/10 transition-all uppercase tracking-widest mt-2'
                        >
                            Log Activity
                        </motion.button>
                    </form>
                </motion.div>

                {/* List & Chart Section */}
                <div className='lg:col-span-2 space-y-10'>
                    {/* Charts Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='glass-card p-8 rounded-[2rem]'>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Burn Intensity</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorTrendAct" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                                        <Area type="monotone" dataKey="calories" stroke="#f43f5e" fillOpacity={1} fill="url(#colorTrendAct)" strokeWidth={4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='glass-card p-8 rounded-[2rem]'>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Modality Impact</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                                        <Bar dataKey="calories" radius={[6, 6, 6, 6]} barSize={12}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <div>
                        <h2 className='text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter'>Workout History</h2>

                        {activities.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 pr-2'>
                                <AnimatePresence>
                                    {activities.map((activity, index) => (
                                        <motion.div
                                            key={activity._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='glass-card p-6 rounded-3xl flex justify-between items-center group overflow-hidden relative'
                                        >
                                            <div className="absolute inset-y-0 left-0 w-1 bg-rose-500 h-full opacity-50" />
                                            <div className="flex items-center relative z-10">
                                                <div className="bg-black/5 p-4 rounded-2xl mr-5 text-rose-500 border border-black/5 group-hover:border-rose-500/30 transition-colors shadow-black/5 shadow-xl">
                                                    <FaRunning size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-1">
                                                        <span className="text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full tracking-widest">{activity.activityType}</span>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                                            <FaCalendarAlt className="mr-1" /> {new Date(activity.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className='font-bold text-slate-900 text-xl tracking-tight leading-tight uppercase group-hover:text-rose-500 transition-colors'>{activity.activityType} Session</p>
                                                    <div className="flex items-center mt-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                                        <FaClock className="mr-2 text-rose-500/50" />
                                                        {activity.duration} Minutes of Intensity
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='text-right relative z-10'>
                                                <p className='font-black text-4xl text-slate-900 tracking-tighter'>{activity.caloriesBurned}</p>
                                                <p className='text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.3em]'>Kcal Burned</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-24 glass-card rounded-[2.5rem] bg-black/5'>
                                <FaRunning size={48} className="mx-auto text-slate-300 mb-6 opacity-40" />
                                <p className='text-slate-500 font-bold uppercase tracking-widest'>No activity traces found</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
