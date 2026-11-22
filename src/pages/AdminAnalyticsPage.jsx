import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, Shield, Layers } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import api from '../services/api';

const COLORS = ['#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#EC4899', '#8B5CF6'];

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, iRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/incidents?limit=100'),
        ]);

        if (aRes.data.success) setAnalytics(aRes.data);
        if (iRes.data.success) setIncidents(iRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryData = analytics?.categoryData || [
    { name: 'Harassment', value: 12 },
    { name: 'Poor Lighting', value: 8 },
    { name: 'Stalking', value: 5 },
    { name: 'Eve Teasing', value: 9 },
    { name: 'Suspicious Activity', value: 4 },
  ];

  const hourlyData = analytics?.hourlyData || [
    { hour: '18:00', incidents: 3 },
    { hour: '19:00', incidents: 6 },
    { hour: '20:00', incidents: 11 },
    { hour: '21:00', incidents: 14 },
    { hour: '22:00', incidents: 9 },
    { hour: '23:00', incidents: 7 },
  ];

  const monthlyTrends = analytics?.monthlyTrends || [
    { month: 'Jun', incidents: 14 },
    { month: 'Jul', incidents: 22 },
    { month: 'Aug', incidents: 18 },
    { month: 'Sep', incidents: 29 },
    { month: 'Oct', incidents: 34 },
    { month: 'Nov', incidents: 41 },
  ];

  const severityData = analytics?.severityData || [
    { name: 'LOW', count: 8 },
    { name: 'MEDIUM', count: 18 },
    { name: 'HIGH', count: 14 },
    { name: 'CRITICAL', count: 4 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-700" />
          Safety Analytics & Spatial Hazard Heatmap
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Aggregated temporal and spatial risk metrics formatted for machine learning model training and city surveillance prioritization.
        </p>
      </div>

      {/* Grid of Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Categories Pie Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Incident Types Distribution</h3>
            <p className="text-[11px] text-slate-500 mb-4">Breakdown of crowdsourced reports by category</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Distribution (Night Risk Spike) */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Time-of-Day Incident Density</h3>
            <p className="text-[11px] text-slate-500 mb-4">Hourly distribution highlighting evening & nighttime peaks</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip />
                <Bar dataKey="incidents" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Progression Trend */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Community Reporting Trends</h3>
            <p className="text-[11px] text-slate-500 mb-4">Monthly incident resolution & crowdsourcing trajectory</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Severity Classification */}
        <div className="bg-white rounded-3xl p-6 shadow-soft-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Severity Tier Assessment</h3>
            <p className="text-[11px] text-slate-500 mb-4">Count of reported events categorized by threat level</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spatial Hazard Heatmap Map View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-700" />
              Spatial Hazard & Incident Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Clustered coordinates of verified incidents used to derive route safety coefficients
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            {incidents.length} Spatial Markers Plotted
          </span>
        </div>

        <InteractiveMap
          center={{ lat: 28.6139, lng: 77.2090 }}
          incidents={incidents}
          height="460px"
        />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
