import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon, color }) => {
    // Extract base color name (e.g., 'blue', 'green') from classes if needed, 
    // or just rely on the passed color prop assuming it contains full class strings.
    // However, to make it cleaner, let's assume `color` is like 'blue' and we build classes dynamically.
    // The previous implementation utilized 'border-color-500' string replacements which is a bit fragile but worked.
    // Let's make it more robust.

    // Actually, to avoid breaking existing usages, I'll stick to receiving `color` as 'border-color-500'.
    // But I will parse it to apply background colors.

    const getColorClass = (type) => {
        // color is like 'border-green-500'
        const base = color.replace('border-', '').replace('-500', '');
        if (type === 'bg') return `bg-${base}-100`;
        if (type === 'text') return `text-${base}-600`;
        if (type === 'icon-bg') return `bg-${base}-500`;
        return '';
    };

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`glass-card p-6 rounded-2xl border-l-[6px] ${color}`}
        >
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-gray-500 text-xs font-bold tracking-wider uppercase mb-1'>{title}</h3>
                    <p className='text-3xl font-extrabold text-gray-800'>{value}</p>
                </div>
                <div className={`p-4 rounded-xl ${color.replace('border-', 'bg-').replace('500', '100')} text-${color.replace('border-', '').replace('500', '600')} shadow-sm`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardCard;
