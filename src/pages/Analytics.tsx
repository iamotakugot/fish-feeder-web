import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  API_CONFIG,
  FishFeederApiClient,
  AllSensorsResponse,
} from "../config/api";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiClient] = useState(new FishFeederApiClient());

  // Helper function to extract sensor value by type
  const extractSensorValue = (sensorData: any, valueType: string): number => {
    if (!sensorData?.values || !Array.isArray(sensorData.values)) {
      return 0;
    }

    const valueObj = sensorData.values.find((v: any) => v.type === valueType);

    return valueObj
      ? typeof valueObj.value === "number"
        ? valueObj.value
        : 0
      : 0;
  };

  // Generate mock historical data based on current sensor values
  const generateMockData = (sensorsData: AllSensorsResponse) => {
    const data = [];
    const currentTime = new Date();
    const hours =
      timeRange === "24h" ? 24 : timeRange === "7d" ? 24 * 7 : 24 * 30;
    const interval = timeRange === "24h" ? 1 : timeRange === "7d" ? 6 : 24; // hours

    // Extract current values as baseline
    const sensors = sensorsData.data;
    const baseData = {
      temperature: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.DHT22_FEEDER],
        "temperature",
      ),
      humidity: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.DHT22_FEEDER],
        "humidity",
      ),
      waterTemperature: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.DS18B20_WATER_TEMP],
        "temperature",
      ),
      weight: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.HX711_FEEDER],
        "weight",
      ),
      moisture: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.SOIL_MOISTURE],
        "moisture",
      ),
      batteryVoltage: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.LOAD_VOLTAGE],
        "voltage",
      ),
      solarCurrent: extractSensorValue(
        sensors[API_CONFIG.SENSOR_NAMES.SOLAR_CURRENT],
        "current",
      ),
    };

    for (let i = hours; i >= 0; i -= interval) {
      const time = new Date(currentTime.getTime() - i * 60 * 60 * 1000);
      const variation = 0.9 + Math.random() * 0.2; // ±10% variation

      data.push({
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: time.toISOString(),
        temperature: Math.round(baseData.temperature * variation * 10) / 10,
        humidity: Math.round(baseData.humidity * variation * 10) / 10,
        waterTemperature:
          Math.round(baseData.waterTemperature * variation * 10) / 10,
        weight: Math.round(baseData.weight * variation * 100) / 100,
        moisture: Math.round(baseData.moisture * variation * 10) / 10,
        batteryVoltage:
          Math.round(baseData.batteryVoltage * variation * 10) / 10,
        solarCurrent: Math.round(baseData.solarCurrent * variation * 100) / 100,
      });
    }

    return data;
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Get current sensor data from Pi server
      const sensorsData = await apiClient.getAllSensors();

      // Generate mock historical data based on current values
      const mockData = generateMockData(sensorsData);

      setChartData(mockData);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);

      // Fallback mock data
      setChartData([
        {
          time: "12:00",
          temperature: 25.5,
          humidity: 65,
          waterTemperature: 24.0,
          weight: 2.5,
          moisture: 45,
          batteryVoltage: 12.5,
          solarCurrent: 0.5,
        },
        {
          time: "13:00",
          temperature: 26.1,
          humidity: 62,
          waterTemperature: 24.2,
          weight: 2.48,
          moisture: 44,
          batteryVoltage: 12.4,
          solarCurrent: 0.8,
        },
        {
          time: "14:00",
          temperature: 27.2,
          humidity: 59,
          waterTemperature: 24.5,
          weight: 2.45,
          moisture: 43,
          batteryVoltage: 12.6,
          solarCurrent: 1.2,
        },
        {
          time: "15:00",
          temperature: 28.0,
          humidity: 57,
          waterTemperature: 25.0,
          weight: 2.42,
          moisture: 42,
          batteryVoltage: 12.7,
          solarCurrent: 1.5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-8">
      {/* Header with Time Range Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              📊 Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor sensor trends and system performance
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === "24h"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setTimeRange("24h")}
            >
              24H
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === "7d"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setTimeRange("7d")}
            >
              7D
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === "30d"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setTimeRange("30d")}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          🌡️ Temperature Trends
        </h2>
        <div className="h-80">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={chartData}>
              <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
              <XAxis
                className="text-gray-600 dark:text-gray-400"
                dataKey="time"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
              <Line
                dataKey="temperature"
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="Feeder Temp (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="waterTemperature"
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                name="Water Temp (°C)"
                stroke="#06b6d4"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Humidity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            💧 Humidity & Weight
          </h2>
          <div className="h-64">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={chartData}>
                <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
                <XAxis
                  className="text-gray-600 dark:text-gray-400"
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Line
                  dataKey="humidity"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  name="Humidity (%)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="weight"
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                  name="Food Weight (g)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Power System Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            🔋 Power System
          </h2>
          <div className="h-64">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={chartData}>
                <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
                <XAxis
                  className="text-gray-600 dark:text-gray-400"
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  className="text-gray-600 dark:text-gray-400"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Line
                  dataKey="batteryVoltage"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  name="Battery (V)"
                  stroke="#10b981"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="solarCurrent"
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                  name="Solar Current (A)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          📈 Summary Statistics ({timeRange.toUpperCase()})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {chartData.length > 0 &&
                Math.max(...chartData.map((d) => d.temperature || 0)).toFixed(
                  1,
                )}
              °C
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Max Temperature
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chartData.length > 0 &&
                Math.max(...chartData.map((d) => d.humidity || 0)).toFixed(0)}
              %
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Max Humidity
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {chartData.length > 0 &&
                Math.max(
                  ...chartData.map((d) => d.batteryVoltage || 0),
                ).toFixed(1)}
              V
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Max Battery
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {chartData.length > 0 &&
                Math.min(...chartData.map((d) => d.weight || 1000)).toFixed(1)}
              g
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Min Food Weight
            </div>
          </div>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Data Export & Actions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export data or refresh analytics
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              onClick={() => alert("Export functionality coming soon!")}
            >
              📥 Export CSV
            </button>
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              disabled={loading}
              onClick={fetchAnalyticsData}
            >
              {loading ? "🔄 Loading..." : "🔄 Refresh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
