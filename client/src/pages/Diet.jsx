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
        calories: ''
    });

    // Stats
    const [totalConsumed, setTotalConsumed] = useState(0);
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
        setTotalConsumed(total);
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
            setFormData({ mealType: 'Breakfast', foodItems: '', calories: '' });
            toast.success('Meal added successfully');
        } catch (error) {
            console.error('Error adding meal:', error);
            toast.error('Failed to add meal');
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className='container mx-auto px-6 py-8'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center mb-8'
            >
                <div className="p-3 bg-green-100 text-green-600 rounded-xl mr-4 shadow-sm">
                    <FaUtensils size={28} />
                </div>
                <h1 className='text-3xl font-extrabold text-gray-800'>Diet Tracker</h1>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-green-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Consumed</p>
                            <p className="text-3xl font-extrabold text-gray-800">{totalConsumed} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                        <FaAppleAlt className="text-green-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-yellow-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Meals Logged</p>
                            <p className="text-3xl font-extrabold text-gray-800">{diets.length}</p>
                        </div>
                        <FaUtensils className="text-yellow-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl border-l-[6px] border-blue-500 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase">Avg. Calories/Meal</p>
                            <p className="text-3xl font-extrabold text-gray-800">{avgCalories} <span className="text-sm font-normal text-gray-500">kcal</span></p>
                        </div>
                        <FaLeaf className="text-blue-500 text-3xl opacity-80" />
                    </div>
                </motion.div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className='glass-card p-8 rounded-3xl h-fit shadow-xl'
                >
                    <h2 className='text-xl font-bold mb-6 text-gray-800'>Log Meal</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Meal Type</label>
                            <select
                                name='mealType'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none bg-white'
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
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Food Items</label>
                            <input
                                type='text'
                                name='foodItems'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                placeholder='e.g., Oatmeal, Salad'
                                value={formData.foodItems}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-600 text-sm font-bold mb-2'>Calories</label>
                            <input
                                type='number'
                                name='calories'
                                className='glass-input w-full px-4 py-3 rounded-xl focus:outline-none'
                                value={formData.calories}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type='submit'
                            className='w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-2'
                        >
                            <span className="flex items-center justify-center">
                                <FaCarrot className="mr-2" /> Add Meal
                            </span>
                        </motion.button>
                    </form>
                </motion.div>

                <div className='lg:col-span-2 space-y-8'>
                    {/* Charts Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Meal Type Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className='glass-card p-6 rounded-3xl'
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Meal Type Breakdown</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconSize={10} verticalAlign="middle" align="right" layout="vertical" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Meals Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className='glass-card p-6 rounded-3xl'
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Calorie Intake (Recent)</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={recentMealsData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]}>
                                            {
                                                recentMealsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.calories > 500 ? '#ef4444' : '#10b981'} />
                                                ))
                                            }
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
                            Today's Meals
                        </motion.h2>

                        {diets.length > 0 ? (
                            <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                                <AnimatePresence>
                                    {diets.map((diet, index) => (
                                        <motion.div
                                            key={diet._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center'
                                        >
                                            <div className="flex items-center">
                                                <div className="bg-green-50 p-3 rounded-full mr-4 text-green-500">
                                                    <FaLeaf size={20} />
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-800 text-lg'>{diet.mealType}</p>
                                                    <p className='text-sm text-gray-600'>{diet.foodItems}</p>
                                                </div>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-extrabold text-2xl text-green-600'>{diet.calories}</p>
                                                <div className="flex items-center justify-end text-xs text-gray-400 mt-1">
                                                    <FaCalendarAlt className="mr-1" size={10} />
                                                    {new Date(diet.date).toLocaleDateString()}
                                                </div>
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
                                <FaUtensils size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className='text-gray-500 text-lg'>No meals logged yet.</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diet;
