import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import { FaWalking, FaFire, FaWeight, FaUtensils } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [diets, setDiets] = useState([]);

    // Stats
    const [caloriesBurnedToday, setCaloriesBurnedToday] = useState(0);
    const [caloriesConsumedToday, setCaloriesConsumedToday] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [goalProgress, setGoalProgress] = useState([]);

    // Safe BMI Calculation
    const calculateBMI = () => {
        if (!user || !user.height || !user.weight || user.height === 0) return { value: 'N/A', status: 'Unknown', color: 'border-gray-300' };

        const heightInMeters = user.height / 100;
        const bmiValue = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);

        let status = '';
        let color = '';

        if (bmiValue < 18.5) { status = 'Underweight'; color = 'border-yellow-500'; }
        else if (bmiValue >= 18.5 && bmiValue < 24.9) { status = 'Normal'; color = 'border-green-500'; }
        else if (bmiValue >= 25 && bmiValue < 29.9) { status = 'Overweight'; color = 'border-orange-500'; }
        else { status = 'Obese'; color = 'border-red-500'; }

        return { value: bmiValue, status, color };
    };

    const bmiInfo = calculateBMI();

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            try {
                const activitiesRes = await axios.get('http://localhost:5001/api/activities', config);
                const dietsRes = await axios.get('http://localhost:5001/api/diets', config);

                setActivities(activitiesRes.data);
                setDiets(dietsRes.data);

                calculateStats(activitiesRes.data, dietsRes.data);

            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };

        fetchData();
    }, [user]);

    const calculateStats = (activitiesData, dietsData) => {
        const today = new Date().toISOString().split('T')[0];

        // Today's Stats
        const burnedToday = activitiesData
            .filter(act => act.date.startsWith(today))
            .reduce((acc, curr) => acc + curr.caloriesBurned, 0);

        const consumedToday = dietsData
            .filter(diet => diet.date.startsWith(today))
            .reduce((acc, curr) => acc + curr.calories, 0);

        setCaloriesBurnedToday(burnedToday);
        setCaloriesConsumedToday(consumedToday);

        // Calculate Goal Progress (Assuming 2000kcal Goal)
        const dailyGoal = 2000;
        const progress = Math.min((consumedToday / dailyGoal) * 100, 100);
        setGoalProgress([{
            name: 'Calories',
            uv: progress,
            pv: 2400,
            fill: '#8884d8'
        }]);

        // Weekly Chart Data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        const newChartData = last7Days.map(date => {
            const dayBurned = activitiesData
                .filter(act => act.date.startsWith(date))
                .reduce((acc, curr) => acc + curr.caloriesBurned, 0);

            const dayConsumed = dietsData
                .filter(diet => diet.date.startsWith(date))
                .reduce((acc, curr) => acc + curr.calories, 0);

            return {
                name: date.slice(5), // MM-DD
                calories: dayConsumed,
                burned: dayBurned
            };
        });

        setChartData(newChartData);

        // Pie Chart Data (Meal Distribution)
        const meals = { 'Breakfast': 0, 'Lunch': 0, 'Dinner': 0, 'Snack': 0 };
        dietsData.forEach(diet => {
            if (meals[diet.mealType] !== undefined) {
                meals[diet.mealType] += diet.calories;
            }
        });

        const newPieData = Object.keys(meals).map(key => ({
            name: key,
            value: meals[key]
        })).filter(item => item.value > 0);

        setPieData(newPieData);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className='container mx-auto px-6 py-8'
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='mb-8'
            >
                <h1 className='text-4xl font-extrabold text-gray-800 mb-2'>
                    Hello, <span className="text-blue-600">{user && user.name}</span> 👋
                </h1>
                <p className="text-gray-500">Here's your daily health summary</p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'
            >
                <DashboardCard
                    title='BMI Status'
                    value={`${bmiInfo.value} (${bmiInfo.status})`}
                    icon={<FaWeight size={24} />}
                    color={bmiInfo.color}
                />
                <DashboardCard
                    title='Calories Burned'
                    value={`${caloriesBurnedToday} kcal`}
                    icon={<FaFire size={24} />}
                    color='border-red-500'
                />
                <DashboardCard
                    title='Calories Consumed'
                    value={`${caloriesConsumedToday} kcal`}
                    icon={<FaUtensils size={24} />}
                    color='border-green-500'
                />
                <DashboardCard
                    title='Net Calories'
                    value={`${caloriesConsumedToday - caloriesBurnedToday} kcal`}
                    icon={<FaWalking size={24} />}
                    color='border-blue-500'
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='glass-card p-8 rounded-3xl shadow-lg lg:col-span-2'
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className='text-2xl font-bold text-gray-800'>Weekly Activity</h2>
                    </div>

                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                                    </linearGradient>
                                    <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="calories" fill="url(#colorConsumed)" radius={[6, 6, 0, 0]} barSize={12} name="Consumed" />
                                <Bar dataKey="burned" fill="url(#colorBurned)" radius={[6, 6, 0, 0]} barSize={12} name="Burned" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Side Graphs Column */}
                <div className="flex flex-col gap-8">
                    {/* Radial Goal Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='glass-card p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center'
                    >
                        <h2 className='text-xl font-bold text-gray-800 mb-4 self-start'>Daily Goal</h2>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <RadialBarChart
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    data={goalProgress}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='uv' />
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-700">
                                        {Math.round(goalProgress[0]?.uv || 0)}%
                                    </text>
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">of 2000kcal Goal</p>
                    </motion.div>

                    {/* Meal Distribution Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className='glass-card p-8 rounded-3xl shadow-lg'
                    >
                        <h2 className='text-xl font-bold text-gray-800 mb-2'>Meal Split</h2>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
