import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUtensils, FaLeaf, FaCarrot, FaCalendarAlt, FaAppleAlt, FaClock } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Diet = () => {
    const [diets, setDiets] = useState([]);
    const [formData, setFormData] = useState({
        mealType: 'Breakfast',
        foodItems: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });

    // Stats
    const [totalConsumed, setTotalConsumed] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFats, setTotalFats] = useState(0);
    const [avgCalories, setAvgCalories] = useState(0);
    const [pieData, setPieData] = useState([]);
    const [recentMealsData, setRecentMealsData] = useState([]);

    const { user } = useContext(AuthContext);

    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };

    const fetchDiets = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/diets', config);
            setDiets(response.data);
            calculateStats(response.data);
        } catch (error) {
            console.error('Error fetching diets:', error);
        }
    };

    const calculateStats = (data) => {
        const total = data.reduce((acc, curr) => acc + curr.calories, 0);
        const p = data.reduce((acc, curr) => acc + (curr.protein || 0), 0);
        const c = data.reduce((acc, curr) => acc + (curr.carbs || 0), 0);
        const f = data.reduce((acc, curr) => acc + (curr.fats || 0), 0);

        setTotalConsumed(total);
        setTotalProtein(p);
        setTotalCarbs(c);
        setTotalFats(f);
        setAvgCalories(data.length > 0 ? Math.round(total / data.length) : 0);

        // Pie Data
        const meals = {};
        data.forEach(d => {
            if (meals[d.mealType]) meals[d.mealType] += 1;
            else meals[d.mealType] = 1;
        });

        const newPieData = Object.keys(meals).map(key => ({
            name: key,
            value: meals[key]
        }));
        setPieData(newPieData);

        // Recent Meals Chart Data (Last 7 meals)
        const recent = data.slice(0, 7).map(d => ({
            name: d.foodItems.length > 10 ? d.foodItems.substring(0, 10) + '...' : d.foodItems,
            calories: d.calories,
            fullDate: d.date
        })).reverse(); // Reverse to show oldest to newest left to right
        setRecentMealsData(recent);
    };

    useEffect(() => {
        if (user && user.token) {
            fetchDiets();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/diets', formData, config);
            const updatedDiets = [response.data, ...diets];
            setDiets(updatedDiets);
            calculateStats(updatedDiets);
            setFormData({ mealType: 'Breakfast', foodItems: '', calories: '', protein: '', carbs: '', fats: '' });
            toast.success('Meal added successfully');
        } catch (error) {
            console.error('Error adding meal:', error);
            toast.error('Failed to add meal');
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className='container mx-auto px-6'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center mb-10'
            >
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl mr-5 shadow-inner border border-emerald-500/20">
                    <FaUtensils size={24} />
                </div>
                <div>
                    <h1 className='text-4xl font-black text-slate-900 tracking-tight uppercase'>Nutrition Log</h1>
                    <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">Fuel your progress</p>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5 rounded-3xl border-l-[6px] border-emerald-500">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Calories</p>
                    <p className="text-2xl font-black text-slate-900">{totalConsumed} <span className="text-xs font-medium text-slate-500">KCAL</span></p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5 rounded-3xl border-l-[6px] border-indigo-500">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Protein</p>
                    <p className="text-2xl font-black text-indigo-500">{totalProtein} <span className="text-xs font-medium text-slate-500">G</span></p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5 rounded-3xl border-l-[6px] border-amber-500">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Carbs</p>
                    <p className="text-2xl font-black text-amber-500">{totalCarbs} <span className="text-xs font-medium text-slate-500">G</span></p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-card p-5 rounded-3xl border-l-[6px] border-rose-500">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Fats</p>
                    <p className="text-2xl font-black text-rose-500">{totalFats} <span className="text-xs font-medium text-slate-500">G</span></p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5 rounded-3xl border-l-[6px] border-purple-500 md:hidden lg:block">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Logged</p>
                    <p className="text-2xl font-black text-slate-900">{diets.length}</p>
                </motion.div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='glass-card p-10 rounded-[2.5rem] h-fit sticky top-28'
                >
                    <h2 className='text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter'>Add New Meal</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Meal Window</label>
                            <select
                                name='mealType'
                                className='glass-input w-full px-5 py-4 rounded-2xl focus:outline-none appearance-none cursor-pointer'
                                value={formData.mealType}
                                onChange={handleChange}
                            >
                                <option value='Breakfast'>Breakfast</option>
                                <option value='Lunch'>Lunch</option>
                                <option value='Dinner'>Dinner</option>
                                <option value='Snack'>Snack</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Food Items</label>
                            <input
                                type='text'
                                name='foodItems'
                                className='glass-input w-full px-5 py-4 rounded-2xl focus:outline-none'
                                placeholder='What did you eat?'
                                value={formData.foodItems}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className='block text-slate-600 text-xs font-black mb-3 uppercase tracking-widest'>Calories</label>
                                <input
                                    type='number'
                                    name='calories'
                                    className='glass-input w-full px-5 py-4 rounded-2xl'
                                    value={formData.calories}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-indigo-600 text-xs font-black mb-3 uppercase tracking-widest'>Protein (G)</label>
                                <input
                                    type='number'
                                    name='protein'
                                    className='glass-input w-full px-5 py-4 rounded-2xl border-indigo-500/20'
                                    value={formData.protein}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className='block text-amber-600 text-xs font-black mb-3 uppercase tracking-widest'>Carbs (G)</label>
                                <input
                                    type='number'
                                    name='carbs'
                                    className='glass-input w-full px-5 py-4 rounded-2xl border-amber-500/20'
                                    value={formData.carbs}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='block text-rose-600 text-xs font-black mb-3 uppercase tracking-widest'>Fats (G)</label>
                                <input
                                    type='number'
                                    name='fats'
                                    className='glass-input w-full px-5 py-4 rounded-2xl border-rose-500/20'
                                    value={formData.fats}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all uppercase tracking-widest'
                        >
                            Log Meal Entry
                        </motion.button>
                    </form>
                </motion.div>

                <div className='lg:col-span-2 space-y-10'>
                    {/* Charts Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='glass-card p-8 rounded-[2rem]'>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Type Distribution</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='glass-card p-8 rounded-[2rem]'>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Recent Intake Trends</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={recentMealsData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
                                        <Bar dataKey="calories" radius={[6, 6, 6, 6]} barSize={12}>
                                            {recentMealsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.calories > 600 ? '#f43f5e' : '#10b981'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    <div>
                        <h2 className='text-2xl font-black mb-8 text-slate-900 uppercase tracking-tighter'>Recent Meal Logs</h2>
                        {diets.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 pr-2'>
                                <AnimatePresence>
                                    {diets.map((diet, index) => (
                                        <motion.div
                                            key={diet._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='glass-card p-6 rounded-3xl flex justify-between items-center group overflow-hidden relative'
                                        >
                                            <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 h-full opacity-50" />
                                            <div className="flex items-center relative z-10">
                                                <div className="bg-black/5 p-4 rounded-2xl mr-5 text-emerald-600 border border-black/5 group-hover:border-emerald-500/30 transition-colors shadow-black/5 shadow-xl">
                                                    <FaLeaf size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full tracking-widest">{diet.mealType}</span>
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                                            <FaClock className="mr-1" /> {new Date(diet.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className='font-bold text-slate-900 text-xl tracking-tight leading-tight'>{diet.foodItems}</p>
                                                    <div className="flex gap-4 mt-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protein</span>
                                                            <span className="text-sm font-black text-indigo-500">{diet.protein}g</span>
                                                        </div>
                                                        <div className="flex flex-col border-x border-black/5 px-4">
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Carbs</span>
                                                            <span className="text-sm font-black text-amber-500">{diet.carbs}g</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fats</span>
                                                            <span className="text-sm font-black text-rose-500">{diet.fats}g</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='text-right relative z-10'>
                                                <p className='font-black text-4xl text-slate-900 tracking-tighter'>{diet.calories}</p>
                                                <p className='text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.3em]'>Kcal</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-24 glass-card rounded-[2.5rem] bg-black/5'>
                                <FaUtensils size={48} className="mx-auto text-slate-300 mb-6 opacity-40" />
                                <p className='text-slate-500 font-bold uppercase tracking-widest'>No meals detected in range</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diet;
