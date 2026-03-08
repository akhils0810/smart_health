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
            className='container mx-auto px-6'
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className='mb-10'
            >
                <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-xs mb-3">Overview Dashboard</p>
                <h1 className='text-5xl font-black text-slate-900 tracking-tight mb-2'>
                    Hello, <span className="text-gradient">{user && user.name}</span>
                </h1>
                <p className="text-slate-600 font-medium">Your health insights at a glance.</p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
            >
                <DashboardCard
                    title='BMI Status'
                    value={`${bmiInfo.value} (${bmiInfo.status})`}
                    icon={<FaWeight size={20} />}
                    color={bmiInfo.color}
                />
                <DashboardCard
                    title='Calories Burned'
                    value={`${caloriesBurnedToday} kcal`}
                    icon={<FaFire size={20} />}
                    color='border-rose-500'
                />
                <DashboardCard
                    title='Calories Consumed'
                    value={`${caloriesConsumedToday} kcal`}
                    icon={<FaUtensils size={20} />}
                    color='border-emerald-500'
                />
                <DashboardCard
                    title='Net Balance'
                    value={`${caloriesConsumedToday - caloriesBurnedToday} kcal`}
                    icon={<FaWalking size={20} />}
                    color='border-indigo-500'
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className='glass-card p-10 rounded-[2.5rem] lg:col-span-2 relative overflow-hidden'
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className='text-3xl font-black text-slate-900 uppercase tracking-tighter'>Weekly Analysis</h2>
                                <p className="text-slate-600 text-sm font-medium">Burn vs Intake performance</p>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex items-center text-xs font-bold text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" /> Consumed
                                </div>
                                <div className="flex items-center text-xs font-bold text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> Burned
                                </div>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 350 }}>
                            {chartData.every(d => d.calories === 0 && d.burned === 0) ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <FaWalking size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest text-center">No activity or meals logged<br />in the last 7 days</p>
                                </div>
                            ) : (
                                <ResponsiveContainer>
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                                            </linearGradient>
                                            <linearGradient id="colorBurned" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}
                                            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                        />
                                        <Bar dataKey="calories" fill="url(#colorConsumed)" radius={[6, 6, 6, 6]} barSize={8} name="Consumed" />
                                        <Bar dataKey="burned" fill="url(#colorBurned)" radius={[6, 6, 6, 6]} barSize={8} name="Burned" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Side Graphs Column */}
                <div className="flex flex-col gap-8">
                    {/* Radial Goal Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className='glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center'
                    >
                        <h2 className='text-xl font-black text-slate-900 uppercase tracking-wider mb-6 self-start'>Daily Goal</h2>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <RadialBarChart
                                    innerRadius="75%"
                                    outerRadius="100%"
                                    data={goalProgress}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <RadialBar minAngle={15} background clockWise={true} dataKey='uv' cornerRadius={10} fill="#6366f1" />
                                    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-black fill-slate-900">
                                        {Math.round(goalProgress[0]?.uv || 0)}%
                                    </text>
                                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-600 uppercase tracking-widest">
                                        Completed
                                    </text>
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-slate-600 text-xs font-bold mt-4 uppercase tracking-widest">{caloriesConsumedToday} / 2000 KCAL</p>
                    </motion.div>

                    {/* Meal Distribution Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className='glass-card p-10 rounded-[2.5rem]'
                    >
                        <h2 className='text-xl font-black text-slate-900 uppercase tracking-wider mb-6'>Meal Split</h2>
                        <div style={{ width: '100%', height: 200 }}>
                            {pieData.length > 0 ? (
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
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <FaUtensils size={32} className="mb-3 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-center">No meals logged<br />today</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
