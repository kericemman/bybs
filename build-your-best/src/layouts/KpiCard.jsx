import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Target } from 'lucide-react';

const iconMap = {
  revenue: DollarSign,
  users: Users,
  time: Clock,
  target: Target,
};

export default function KpiCard({ 
  title, 
  value, 
  trend = 0, 
  icon = 'target',
  subtitle = '',
  loading = false,
  onClick
}) {
  const IconComponent = iconMap[icon] || Target;
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 shadow-sm hover:shadow-md 
        border border-gray-100 transition-all duration-300
        ${onClick ? 'cursor-pointer hover:border-blue-100' : ''}
      `}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Trend Indicator */}
        {trend !== 0 && (
          <div className={`
            flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${isPositive ? 'bg-green-50 text-green-700' : ''}
            ${isNegative ? 'bg-red-50 text-red-700' : ''}
            ${!isPositive && !isNegative ? 'bg-gray-50 text-gray-700' : ''}
          `}>
            {isPositive && <TrendingUp className="w-3 h-3 mr-1" />}
            {isNegative && <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      {/* Main Value */}
      <div className="mb-2">
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
        ) : (
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        )}
      </div>
      
      {/* Optional Metric Description */}
      {loading ? (
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
      ) : trend !== 0 && (
        <p className="text-xs text-gray-500">
          {isPositive ? 'Increase' : isNegative ? 'Decrease' : 'No change'} from last period
        </p>
      )}
    </motion.div>
  );
}

// Alternate Compact Version
export function KpiCardCompact({ title, value, icon = 'target', color = 'blue' }) {
  const IconComponent = iconMap[icon] || Target;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// Metric Comparison Card
export function KpiComparisonCard({ 
  title, 
  currentValue, 
  previousValue, 
  unit = '',
  icon = 'target'
}) {
  const IconComponent = iconMap[icon] || Target;
  const change = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
          <IconComponent className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline">
            <h3 className="text-3xl font-bold text-gray-900">{currentValue}</h3>
            {unit && <span className="text-gray-500 ml-1">{unit}</span>}
          </div>
          <p className="text-sm text-gray-500">Current Period</p>
        </div>
        
        {previousValue && (
          <div>
            <div className="flex items-baseline">
              <h4 className="text-xl font-semibold text-gray-700">{previousValue}</h4>
              {unit && <span className="text-gray-500 ml-1">{unit}</span>}
            </div>
            <p className="text-sm text-gray-500">Previous Period</p>
          </div>
        )}
      </div>
      
      {previousValue && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Change</span>
            <span className={`
              flex items-center text-sm font-medium
              ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}
            `}>
              {isPositive && <TrendingUp className="w-4 h-4 mr-1" />}
              {isNegative && <TrendingDown className="w-4 h-4 mr-1" />}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}