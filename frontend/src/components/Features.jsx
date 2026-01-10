import React from 'react';
import { FiZap, FiShield, FiBarChart2, FiCpu, FiGlobe, FiLock } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: 'Real-time Analysis',
      description: 'Instant sentiment detection with sub-second response times',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: FiCpu,
      title: 'AI-Powered',
      description: 'Advanced machine learning model for accurate emotion detection',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: FiShield,
      title: 'Secure Processing',
      description: 'Your data is processed securely and never stored permanently',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: FiLock,
      title: 'Privacy First',
      description: 'No data retention policy for maximum privacy',
      color: 'from-indigo-400 to-violet-500'
    }
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Our Analyzer</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="glass-card p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl group"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;