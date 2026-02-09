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
        <div className='container mx-auto px-6 py-8'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center mb-8'
            >
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl mr-4 shadow-sm">
                    <FaRunning size={28} />
                </div>
                <h1 className='text-3xl font-extrabold text-gray-800'>Activity Tracker</h1>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-orange-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Burned</p>
                            <p className="text-3xl font-extrabold text-gray-800">{totalBurned} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                        <FaFire className="text-orange-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-blue-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Duration</p>
                            <p className="text-3xl font-extrabold text-gray-800">{totalDuration} <span className="text-sm font-normal text-gray-500">min</span></p>
                        </div>
                        <FaClock className="text-blue-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-green-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Logged Activities</p>
                            <p className="text-3xl font-extrabold text-gray-800">{activities.length}</p>
                        </div>
                        <FaTrophy className="text-green-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className='glass-card p-8 rounded-3xl h-fit shadow-xl'
                >
                    <h2 className='text-xl font-bold mb-6 text-gray-800'>Log New Workout</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Activity Type</label>
                            <select
                                name='activityType'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none bg-white'
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
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Duration (min)</label>
                            <input
                                type='number'
                                name='duration'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                placeholder='e.g., 30'
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Calories Burned</label>
                            <input
                                type='number'
                                name='caloriesBurned'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                value={formData.caloriesBurned}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-2'
                        >
                            <span className="flex items-center justify-center">
                                <FaRunning className="mr-2" /> Log Activity
                            </span>
                        </motion.button>
                    </form>
                </motion.div>

                {/* List & Chart Section */}
                <div className='lg:col-span-2 space-y-8'>
                    {/* Charts Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Weekly Trend Area Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='glass-card p-6 rounded-3xl'
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">7-Day Burn Trend</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ff8042" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Area type="monotone" dataKey="calories" stroke="#ff8042" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Activity Type Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className='glass-card p-6 rounded-3xl'
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Burn by Type</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='text-xl font-bold mb-6 text-gray-800 ml-1'
                        >
                            Recent Activities
                        </motion.h2>

                        {activities.length > 0 ? (
                            <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                                <AnimatePresence>
                                    {activities.map((activity, index) => (
                                        <motion.div
                                            key={activity._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center'
                                        >
                                            <div className="flex items-center">
                                                <div className="bg-orange-50 p-3 rounded-full mr-4 text-orange-500">
                                                    <FaRunning size={20} />
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-800 text-lg'>{activity.activityType}</p>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <FaCalendarAlt className="mr-1" size={12} />
                                                        <span className="mr-3">{new Date(activity.date).toLocaleDateString()}</span>
                                                        <FaClock className="mr-1" size={12} />
                                                        <span>{activity.duration} min</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-extrabold text-2xl text-orange-500'>{activity.caloriesBurned}</p>
                                                <p className='text-xs text-gray-400 font-bold uppercase'>kcal</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-center py-20 bg-white rounded-3xl opacity-60'
                            >
                                <FaRunning size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className='text-gray-500 text-lg'>No activities logged yet.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activity;
