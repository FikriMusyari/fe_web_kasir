import { ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const TransactionStats = ({ stats, loading }) => {
  const statsData = [
    {
      name: 'Total Transaksi',
      value: loading ? '...' : stats.totalTransactions,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Pendapatan',
      value: loading ? '...' : stats.totalRevenue,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Rata-rata Transaksi',
      value: loading ? '...' : `Rp ${stats.averageValue?.toLocaleString('id-ID') || '0'}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.bgColor} p-3 rounded-md`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    ) : (
                      stat.value
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          {!loading && (
            <div className={`${stat.bgColor} px-5 py-3`}>
              <div className="text-sm">
                <span className={`font-medium ${stat.textColor}`}>
                  {stat.name === 'Total Transaksi' && 'Semua transaksi'}
                  {stat.name === 'Total Pendapatan' && 'Pendapatan kotor'}
                  {stat.name === 'Rata-rata Transaksi' && 'Per transaksi'}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionStats;
