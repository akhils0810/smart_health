import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon, color }) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-6 rounded-3xl relative overflow-hidden group`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 bg-current ${color.replace('border-', 'text-')}`} />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-black/5 border border-black/5 group-hover:border-black/10 transition-colors shadow-lg shadow-black/5 ${color.replace('border-', 'text-')}`}>
                    {icon}
                </div>
            </div>

            <div className={`mt-4 h-1 w-full bg-black/5 rounded-full overflow-hidden`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color.replace('border-', 'bg-')}`}
                />
            </div>
        </motion.div>
    );
};

export default DashboardCard;
