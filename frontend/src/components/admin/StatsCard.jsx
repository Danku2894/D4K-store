/**
 * StatsCard Component - Street Style
 * Card hiển thị thống kê
 */
const StatsCard = ({ icon: Icon, label, value, change, changeLabel }) => {
  const isPositive = change >= 0;

  return (
    <div className="p-6 border-4 border-dark-950 bg-light-50 hover:shadow-street transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`
          p-3 border-2 border-dark-950
          ${isPositive ? 'bg-street-neon' : 'bg-street-red'}
        `}>
          <Icon size={24} className="text-dark-950" />
        </div>

        {change !== undefined && (
          <div className={`
            px-2 py-1 text-xs font-black uppercase
            ${isPositive ? 'bg-street-neon text-dark-950' : 'bg-street-red text-light-50'}
          `}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </div>
        )}
      </div>

      <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
        {label}
      </p>
      <p className="text-3xl font-display font-black uppercase text-dark-950">
        {value}
      </p>

      {changeLabel && (
        <p className="text-xs text-gray-600 font-medium mt-2">
          {changeLabel}
        </p>
      )}
    </div>
  );
};

export default StatsCard;

