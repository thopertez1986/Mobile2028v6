import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  Cloud,
  Map,
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  AlertCircle,
  Wind,
  Waves,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data based on schema
const mockTyphoons = [
  {
    id: "1",
    local_name: "Carina",
    international_name: "Gaemi",
    signal_level: "3",
    intensity: "Severe Tropical Storm",
    max_wind_speed_kmh: 185,
    gust_speed_kmh: 220,
    central_pressure_hpa: 960,
    latitude: 15.2,
    longitude: 120.5,
    position_description: "East of Luzon",
    movement_direction: "West",
    movement_speed_kmh: 15,
    bulletin_number: 5,
    status: "active",
    landfall_date: "2026-01-15T08:00:00Z",
    created_at: "2026-01-10T14:30:00Z",
    updated_at: "2026-01-12T09:15:00Z",
    forecasts: [
      {
        forecast_hours: 24,
        latitude: 16.0,
        longitude: 119.0,
        position_description: "West Philippine Sea",
        predicted_intensity: "Typhoon",
        predicted_wind_speed_kmh: 200,
      },
      {
        forecast_hours: 48,
        latitude: 17.5,
        longitude: 117.5,
        position_description: "South China Sea",
        predicted_intensity: "Typhoon",
        predicted_wind_speed_kmh: 190,
      },
      {
        forecast_hours: 72,
        latitude: 19.0,
        longitude: 116.0,
        position_description: "Moving away from PAR",
        predicted_intensity: "Severe Tropical Storm",
        predicted_wind_speed_kmh: 160,
      },
    ],
    affected_areas: [
      {
        province: "Quezon",
        municipality: "Lucena",
        signal_level: "3",
        signal_raised_at: "2026-01-11T10:00:00Z",
      },
      {
        province: "Bataan",
        municipality: "Balanga",
        signal_level: "2",
        signal_raised_at: "2026-01-11T14:30:00Z",
      },
      {
        province: "Bulacan",
        municipality: "Malolos",
        signal_level: "1",
        signal_raised_at: "2026-01-12T08:00:00Z",
      },
    ],
    satellite_images: [
      {
        id: "img1",
        image_url:
          "https://placehold.co/600x400/3b82f6/ffffff?text=Satellite+Image+1",
        capture_time: "2026-01-12T06:00:00Z",
      },
      {
        id: "img2",
        image_url:
          "https://placehold.co/600x400/2563eb/ffffff?text=Satellite+Image+2",
        capture_time: "2026-01-12T12:00:00Z",
      },
    ],
  },
  {
    id: "2",
    local_name: "Odette",
    international_name: "Rai",
    signal_level: "4",
    intensity: "Super Typhoon",
    max_wind_speed_kmh: 195,
    gust_speed_kmh: 240,
    central_pressure_hpa: 955,
    latitude: 10.1,
    longitude: 124.6,
    position_description: "Central Visayas",
    movement_direction: "West",
    movement_speed_kmh: 20,
    status: "historical",
    created_at: "2021-12-16T00:00:00Z",
    updated_at: "2021-12-20T00:00:00Z",
  },
  {
    id: "3",
    local_name: "Rolly",
    international_name: "Goni",
    signal_level: "5",
    intensity: "Super Typhoon",
    max_wind_speed_kmh: 225,
    gust_speed_kmh: 280,
    central_pressure_hpa: 920,
    latitude: 13.4,
    longitude: 123.8,
    position_description: "Bicol Region",
    movement_direction: "West-Northwest",
    movement_speed_kmh: 25,
    status: "historical",
    created_at: "2020-11-01T00:00:00Z",
    updated_at: "2020-11-05T00:00:00Z",
  },
];

const mockAnalytics = {
  total_typhoons: 42,
  typhoons_last_12_months: 8,
  average_per_month: 0.67,
  super_typhoons: 15,
  typhoons: 12,
  signal_5_count: 5,
  signal_4_count: 8,
  signal_3_count: 12,
  max_recorded_wind_speed: 315,
  lowest_recorded_pressure: 895,
  monthly_distribution: [
    { month: "Jan", count: 1 },
    { month: "Feb", count: 0 },
    { month: "Mar", count: 2 },
    { month: "Apr", count: 1 },
    { month: "May", count: 0 },
    { month: "Jun", count: 1 },
    { month: "Jul", count: 0 },
    { month: "Aug", count: 1 },
    { month: "Sep", count: 0 },
    { month: "Oct", count: 1 },
    { month: "Nov", count: 1 },
    { month: "Dec", count: 0 },
  ],
  signal_level_distribution: [
    { signal_level: "1", count: 8 },
    { signal_level: "2", count: 10 },
    { signal_level: "3", count: 12 },
    { signal_level: "4", count: 8 },
    { signal_level: "5", count: 4 },
  ],
  intensity_distribution: [
    { intensity: "Super Typhoon", count: 15 },
    { intensity: "Typhoon", count: 12 },
    { intensity: "Severe Tropical Storm", count: 8 },
    { intensity: "Tropical Storm", count: 5 },
    { intensity: "Tropical Depression", count: 2 },
  ],
};

const signalLevelColors = {
  1: "#10b981", // Green
  2: "#f59e0b", // Amber
  3: "#f97316", // Orange
  4: "#ef4444", // Red
  5: "#b91c1c", // Dark Red
};

const intensityColors = {
  "Tropical Depression": "#94a3b8",
  "Tropical Storm": "#64748b",
  "Severe Tropical Storm": "#475569",
  Typhoon: "#1e40af",
  "Super Typhoon": "#1e3a8a",
};

const TyphoonAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTyphoon, setSelectedTyphoon] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [isAddingTyphoon, setIsAddingTyphoon] = useState(false);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSignalBadge = (signalLevel) => {
    if (!signalLevel) return null;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium text-white`}
        style={{ backgroundColor: signalLevelColors[signalLevel] }}
      >
        Signal {signalLevel}
      </span>
    );
  };

  const getIntensityBadge = (intensity) => {
    if (!intensity) return null;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium text-white`}
        style={{ backgroundColor: intensityColors[intensity] }}
      >
        {intensity}
      </span>
    );
  };

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Typhoons</p>
              <p className="text-3xl font-bold mt-1">
                {mockAnalytics.total_typhoons}
              </p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <ArrowLeft size={12} className="mr-1" />
                {mockAnalytics.typhoons_last_12_months} in last 12 months
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Cloud size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Max Wind Speed</p>
              <p className="text-3xl font-bold mt-1">
                {mockAnalytics.max_recorded_wind_speed} km/h
              </p>
              <p className="text-gray-500 text-sm mt-1">Recorded maximum</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Wind size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Lowest Pressure</p>
              <p className="text-3xl font-bold mt-1">
                {mockAnalytics.lowest_recorded_pressure} hPa
              </p>
              <p className="text-gray-500 text-sm mt-1">Recorded minimum</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Waves size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Alerts</p>
              <p className="text-3xl font-bold mt-1">
                <span className="text-red-500">
                  {mockAnalytics.signal_5_count}
                </span>{" "}
                +
                <span className="text-orange-500">
                  {mockAnalytics.signal_4_count}
                </span>{" "}
                +
                <span className="text-yellow-500">
                  {mockAnalytics.signal_3_count}
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-1">Signal 3+ alerts</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity size={20} className="mr-2 text-blue-600" />
            Monthly Typhoon Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockAnalytics.monthly_distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {mockAnalytics.monthly_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count > 0 ? "#3b82f6" : "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Map size={20} className="mr-2 text-green-600" />
            Signal Level Distribution
          </h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalytics.signal_level_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {mockAnalytics.signal_level_distribution.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={signalLevelColors[entry.signal_level]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ marginLeft: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTyphoonList = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Typhoon Records</h3>
        <button
          onClick={() => setIsAddingTyphoon(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Typhoon
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name (Local/Intl)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Signal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intensity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTyphoons.map((typhoon) => (
              <tr
                key={typhoon.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedTyphoon(typhoon)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {typhoon.local_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {typhoon.international_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      typhoon.status === "active"
                        ? "bg-green-100 text-green-800"
                        : typhoon.status === "inactive"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typhoon.status.charAt(0).toUpperCase() +
                      typhoon.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getSignalBadge(typhoon.signal_level)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getIntensityBadge(typhoon.intensity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(typhoon.updated_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye size={18} />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderTyphoonDetail = () => {
    if (!selectedTyphoon) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTyphoon(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Typhoon List
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {selectedTyphoon.local_name}
              </h1>
              <p className="text-xl opacity-90 mb-1">
                {selectedTyphoon.international_name}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {getSignalBadge(selectedTyphoon.signal_level)}
                {getIntensityBadge(selectedTyphoon.intensity)}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedTyphoon.status === "active"
                      ? "bg-green-500/20 text-green-200"
                      : "bg-gray-500/20 text-gray-200"
                  }`}
                >
                  {selectedTyphoon.status.charAt(0).toUpperCase() +
                    selectedTyphoon.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-4xl font-bold">
                {selectedTyphoon.max_wind_speed_kmh} km/h
              </p>
              <p className="opacity-80">Max Sustained Winds</p>
              <p className="mt-2 text-2xl font-bold">
                {selectedTyphoon.central_pressure_hpa} hPa
              </p>
              <p className="opacity-80">Central Pressure</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {["overview", "forecasts", "affected", "satellite", "updates"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    detailTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ),
            )}
          </nav>
        </div>

        {detailTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Map size={20} className="mr-2 text-blue-600" />
                Current Position & Movement
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-medium">
                    {selectedTyphoon.position_description}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Lat: {selectedTyphoon.latitude}, Long:{" "}
                    {selectedTyphoon.longitude}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Movement</p>
                  <p className="font-medium">
                    {selectedTyphoon.movement_direction} at{" "}
                    {selectedTyphoon.movement_speed_kmh} km/h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(selectedTyphoon.updated_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Landfall Expected</p>
                  <p className="font-medium">
                    {selectedTyphoon.landfall_date
                      ? formatDateTime(selectedTyphoon.landfall_date)
                      : "Not expected"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-purple-600" />
                Meteorological Data
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Maximum Wind Speed</p>
                  <p className="text-2xl font-bold">
                    {selectedTyphoon.max_wind_speed_kmh} km/h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gust Speed</p>
                  <p className="text-2xl font-bold">
                    {selectedTyphoon.gust_speed_kmh || "N/A"} km/h
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Central Pressure</p>
                  <p className="text-2xl font-bold">
                    {selectedTyphoon.central_pressure_hpa} hPa
                  </p>
                </div>
                {selectedTyphoon.bulletin_number && (
                  <div>
                    <p className="text-gray-500 text-sm">Bulletin Number</p>
                    <p className="text-2xl font-bold">
                      TC #{selectedTyphoon.bulletin_number}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {detailTab === "forecasts" && selectedTyphoon.forecasts && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-green-600" />
                Forecast Track
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forecast Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Predicted Intensity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wind Speed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTyphoon.forecasts.map((forecast, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {forecast.forecast_hours} hours
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {forecast.position_description}
                          <p className="text-xs text-gray-500 mt-1">
                            Lat: {forecast.latitude}, Long: {forecast.longitude}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getIntensityBadge(forecast.predicted_intensity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {forecast.predicted_wind_speed_kmh} km/h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {detailTab === "affected" && selectedTyphoon.affected_areas && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle size={20} className="mr-2 text-red-600" />
                Affected Areas
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Province
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Municipality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Signal Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Signal Raised
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedTyphoon.affected_areas.map((area, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {area.province}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {area.municipality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getSignalBadge(area.signal_level)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDateTime(area.signal_raised_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {detailTab === "satellite" && selectedTyphoon.satellite_images && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Image size={20} className="mr-2 text-yellow-600" />
              Satellite Imagery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTyphoon.satellite_images.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.image_url}
                    alt={`Satellite image taken at ${formatDateTime(image.capture_time)}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm font-medium">
                      Captured: {formatDateTime(image.capture_time)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Himawari-8 Satellite
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderAddTyphoonForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Typhoon</h2>
        <button
          onClick={() => setIsAddingTyphoon(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Carina"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              International Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Gaemi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Signal Level
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select signal level</option>
              {Object.keys(signalLevelColors).map((level) => (
                <option key={level} value={level}>
                  Signal {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intensity
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select intensity</option>
              {Object.keys(intensityColors).map((intensity) => (
                <option key={intensity} value={intensity}>
                  {intensity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Wind Speed (km/h)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Central Pressure (hPa)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 980"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Position
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Latitude"
              />
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Longitude"
              />
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description (e.g., East of Luzon)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Direction
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., West-Northwest"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Speed (km/h)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="historical">Historical</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsAddingTyphoon(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Typhoon
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <Cloud size={28} className="text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Typhoon Admin</h1>
          </div>
          <p className="text-gray-500 mt-1 text-sm">MDRRMO Pio Duran</p>
        </div>

        <nav className="mt-6">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "typhoons", icon: Cloud, label: "Typhoons" },
            { id: "affected", icon: Map, label: "Affected Areas" },
            { id: "satellite", icon: Image, label: "Satellite Images" },
            { id: "admin", icon: Plus, label: "Admin Actions" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSelectedTyphoon(null);
                setIsAddingTyphoon(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800">Active Alert</p>
            <p className="text-sm text-blue-700 mt-1">
              Signal 3: Severe Tropical Storm Carina approaching Eastern Luzon
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-6 pr-6 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isAddingTyphoon ? (
            renderAddTyphoonForm()
          ) : selectedTyphoon ? (
            renderTyphoonDetail()
          ) : (
            <div>
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "typhoons" && renderTyphoonList()}
              {activeTab === "affected" && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">
                    Affected Areas Management
                  </h2>
                  <p className="text-gray-500">
                    This section would display affected areas by typhoon with
                    management options.
                  </p>
                </div>
              )}
              {activeTab === "satellite" && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">
                    Satellite Imagery Management
                  </h2>
                  <p className="text-gray-500">
                    This section would display and manage satellite images
                    related to typhoons.
                  </p>
                </div>
              )}
              {activeTab === "admin" && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Add New Typhoon</h3>
                      <p className="text-gray-500 mb-4">
                        Create a new typhoon record in the system
                      </p>
                      <button
                        onClick={() => setIsAddingTyphoon(true)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Typhoon
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Manage Users</h3>
                      <p className="text-gray-500 mb-4">
                        Configure admin and staff access permissions
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        <Users size={18} className="mr-2" />
                        Manage Users
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">System Settings</h3>
                      <p className="text-gray-500 mb-4">
                        Configure notification thresholds and system parameters
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        <Settings size={18} className="mr-2" />
                        System Settings
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Data Export</h3>
                      <p className="text-gray-500 mb-4">
                        Export typhoon data for analysis and reporting
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        <Download size={18} className="mr-2" />
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TyphoonAdminDashboard;
