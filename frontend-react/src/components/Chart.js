import React, { useState } from 'react';
import { Bar } from 'recharts';
import { TrendingUp, X, BarChart3 } from 'lucide-react';

const ChartPro = () => {
  const [showChart, setShowChart] = useState(true);

  // Sample weekly data
  const weeklyData = [
    { day: 'Mon', logins: 12 },
    { day: 'Tue', logins: 19 },
    { day: 'Wed', logins: 15 },
    { day: 'Thu', logins: 22 },
    { day: 'Fri', logins: 18 },
    { day: 'Sat', logins: 8 },
    { day: 'Sun', logins: 6 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.logins));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {showChart && (
        <div 
          className="animate-fadeIn"
          style={{
            animation: 'fadeIn 0.8s ease-in-out'
          }}
        >
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-green-100 p-8 transition-all duration-400 hover:shadow-2xl hover:-translate-y-1"
            style={{
              backdropFilter: 'blur(25px)',
              boxShadow: '0 12px 40px rgba(45,159,71,0.12)'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 6px 20px rgba(45, 159, 71, 0.3)'
                  }}
                >
                  <TrendingUp className="text-white" size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800">
                    Weekly Login Overview
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Daily login activity trends
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowChart(false)}
                className="px-5 py-2 border-2 border-green-600 text-green-600 rounded-lg font-bold text-sm transition-all hover:bg-green-50 flex items-center gap-2"
                style={{
                  boxShadow: '0 3px 10px rgba(45,159,71,0.15)'
                }}
              >
                <X size={16} />
                Hide Chart
              </button>
            </div>

            {/* Chart */}
            <div className="h-80 relative">
              <div className="absolute inset-0 flex items-end justify-around px-8 pb-12">
                {weeklyData.map((item, index) => {
                  const heightPercent = (item.logins / maxValue) * 100;
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 max-w-[100px] group">
                      <div className="relative w-full flex flex-col items-center">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold border border-green-500"
                          style={{
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        >
                          {item.logins} logins
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-16 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-700 ease-out hover:from-green-500 hover:to-green-300 cursor-pointer relative overflow-hidden"
                          style={{
                            height: `${heightPercent}%`,
                            minHeight: '8px',
                            boxShadow: '0 -4px 20px rgba(45,159,71,0.3)',
                            animation: `growUp 1.2s ease-out ${index * 0.1}s both`
                          }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Day label */}
                      <div className="mt-3 text-sm font-bold text-gray-700">
                        {item.day}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-4">
                {[4, 3, 2, 1, 0].map((i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right mr-4">
                      {Math.round((maxValue / 4) * i)}
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {weeklyData.reduce((sum, d) => sum + d.logins, 0)}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-semibold">Total Logins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(weeklyData.reduce((sum, d) => sum + d.logins, 0) / weeklyData.length)}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-semibold">Daily Average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {maxValue}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-semibold">Peak Day</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showChart && (
        <div className="max-w-6xl mx-auto text-center">
          <button
            onClick={() => setShowChart(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <BarChart3 size={24} />
            Show Weekly Chart
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--final-height);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ChartPro;