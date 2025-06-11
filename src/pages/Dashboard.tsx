import { FaTemperatureHigh, FaWeight } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoWaterOutline } from "react-icons/io5";
import { BiBattery } from "react-icons/bi";
import { BsLightningCharge, BsCamera } from "react-icons/bs";

import { API_CONFIG } from "../config/api";
import { useSmartSensorData } from "../hooks/useSmartSensorData";
import {
  getCurrentSensorValues,
  formatSensorValue,
  getSensorStatusClass,
} from "../utils/sensorUtils";
import FirebaseRelayControl from "../components/FirebaseRelayControl";

const Dashboard = () => {
  const {
    data: sensorsData,
    loading,
    error,
    lastUpdate,
    isConnected,
    refetch,
  } = useSmartSensorData();

  const connectionStatus = isConnected
    ? "✅ Pi Connected - Live Data"
    : error
      ? `❌ Connection Failed: ${error}`
      : "🔄 Connecting...";

  // Get current sensor values using utility function
  const values = getCurrentSensorValues(sensorsData);

  // Show error state if no data available
  if (!values) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Sensor Data
          </h2>
          <p className="text-gray-600 mb-4">Unable to connect to Pi server</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={refetch}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading && !lastUpdate) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            Connecting to Pi Server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            🐟 Fish Feeder Dashboard
          </h1>
          <div className="text-right text-sm">
            <div
              className={`font-semibold ${
                connectionStatus.includes("✅")
                  ? "text-green-600 dark:text-green-400"
                  : connectionStatus.includes("⚠️")
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {connectionStatus}
            </div>
            {lastUpdate && (
              <div className="text-gray-500 dark:text-gray-400">Last update: {lastUpdate}</div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <strong>API:</strong> {API_CONFIG.BASE_URL} |
          <strong
            className={`ml-2 ${isConnected ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
          >
            {isConnected ? "Live Pi Data" : "Disconnected"}
          </strong>
          {loading && (
            <span className="ml-2 text-blue-500 dark:text-blue-400">🔄 Updating...</span>
          )}
        </div>
      </div>

      {/* Main Grid Layout - ปรับสัดส่วนใหม่ */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Sensors (8 columns) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-12 gap-4">
            {/* Temperature Sensors Row */}
            <div className="col-span-12">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <FaTemperatureHigh className="mr-2 text-red-500" />
                Temperature Monitoring
              </h2>
            </div>

            {/* Feeder Temperature */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Feeder Temp
                  </span>
                  <FaTemperatureHigh className="text-red-500 dark:text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {formatSensorValue(values.feederTemp, "°C")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.feederTemp, 20, 30)}`}
                >
                  {values.feederTemp &&
                  values.feederTemp > 20 &&
                  values.feederTemp < 30
                    ? "Normal"
                    : "Warning"}
                </div>
              </div>
            </div>

            {/* System Temperature */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Temp
                  </span>
                  <FaTemperatureHigh className="text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {formatSensorValue(values.systemTemp, "°C")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.systemTemp, 20, 35)}`}
                >
                  {values.systemTemp &&
                  values.systemTemp > 20 &&
                  values.systemTemp < 35
                    ? "Normal"
                    : "Alert"}
                </div>
              </div>
            </div>

            {/* Water Temperature */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Water Temp
                  </span>
                  <IoWaterOutline className="text-teal-500 dark:text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                  {formatSensorValue(values.waterTemp, "°C")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.waterTemp, 20, 28)}`}
                >
                  {values.waterTemp &&
                  values.waterTemp > 20 &&
                  values.waterTemp < 28
                    ? "Good"
                    : "Alert"}
                </div>
              </div>
            </div>

            {/* Humidity & Weight Row */}
            <div className="col-span-12 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <WiHumidity className="mr-2 text-blue-500" />
                Environmental & Weight
              </h2>
            </div>

            {/* Humidity */}
            <div className="col-span-12 md:col-span-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Humidity
                  </span>
                  <WiHumidity className="text-cyan-500 dark:text-cyan-400 text-xl" />
                </div>
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                  {formatSensorValue(values.feederHumidity, "%")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.feederHumidity, 40, 80)}`}
                >
                  {values.feederHumidity &&
                  values.feederHumidity > 40 &&
                  values.feederHumidity < 80
                    ? "Optimal"
                    : "Check"}
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="col-span-12 md:col-span-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Food Weight
                  </span>
                  <FaWeight className="text-purple-500 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatSensorValue(values.weight, " kg", 2)}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.weight, 1, 10)}`}
                >
                  {values.weight && values.weight > 1 ? "Sufficient" : "Low"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Raw:{" "}
                  {formatSensorValue(
                    values.weight,
                    values.weight && values.weight > 1000 ? " kg" : " g",
                    values.weight && values.weight > 1000 ? 3 : 0,
                  )}
                </div>
              </div>
            </div>

            {/* Power System Row */}
            <div className="col-span-12 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <BsLightningCharge className="mr-2 text-yellow-500" />
                Power System
              </h2>
            </div>

            {/* Battery */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Battery
                  </span>
                  <BiBattery className="text-green-500 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatSensorValue(values.batteryPercentage, "%")}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {values.batteryCharging ? "🔌 Charging" : "🔋 On Battery"}
                </div>
              </div>
            </div>

            {/* Voltage */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Voltage
                  </span>
                  <BsLightningCharge className="text-yellow-500 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatSensorValue(values.loadVoltage, "V")}
                </div>
              </div>
            </div>

            {/* Current */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current
                  </span>
                  <BsLightningCharge className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {formatSensorValue(values.loadCurrent, "A", 2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls & Camera (4 columns) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6">
            {/* Relay Control */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Relay Control
              </h3>
              <FirebaseRelayControl />
            </div>

            {/* Camera Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800 dark:text-gray-100">
                <BsCamera className="mr-2 text-blue-500" />
                Camera Feed
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <BsCamera className="mx-auto mb-2" size={32} />
                  <p className="text-sm">Camera feed will appear here</p>
                  <p className="text-xs">Pi server updating...</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Connection:</span>
                  <span
                    className={`text-sm font-medium ${isConnected ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
                  >
                    {isConnected ? "Connected" : "Updating..."}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Data Source:</span>
                  <span
                    className={`text-sm font-medium ${isConnected ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
                  >
                    {isConnected ? "Pi Sensors" : "Development"}
                  </span>
                </div>
                <button
                  className="w-full mt-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm"
                  onClick={refetch}
                  disabled={loading}
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Debug Information</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>API: {API_CONFIG.BASE_URL}</div>
                <div>Last Update: {lastUpdate || "Never"}</div>
                <div>Status: {connectionStatus}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
