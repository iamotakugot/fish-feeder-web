import { FaTemperatureHigh, FaWeight } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoWaterOutline } from "react-icons/io5";
import { BiBattery } from "react-icons/bi";
import { BsLightningCharge, BsToggleOn, BsToggleOff } from "react-icons/bs";

import { useFirebaseSensorData } from "../hooks/useFirebaseSensorData";
import {
  convertFirebaseToSensorValues,
  formatSensorValue,
  getSensorStatusClass,
  hasSensorData,
  getSensorSummary,
} from "../utils/firebaseSensorUtils";

const FirebaseDashboard = () => {
  const {
    data: firebaseData,
    sensorData,
    loading,
    error,
    lastUpdate,
    isConnected,
    controlLED,
    controlFan,
    turnOffAll,
    sendCommand,
  } = useFirebaseSensorData();

  const connectionStatus = isConnected
    ? "✅ เชื่อมต่อ Firebase แล้ว - ข้อมูลสด"
    : error
      ? "🔌 สถานะการเชื่อมต่อ: ไม่พร้อมใช้งาน"
      : "🔄 กำลังเชื่อมต่อกับ Firebase...";

  // Get current sensor values
  const values = convertFirebaseToSensorValues(sensorData);
  const summary = getSensorSummary(sensorData);

  // Show error state if no data available
  if (!hasSensorData(sensorData) && !loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-orange-500 text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            ยังไม่ได้เชื่อมต่อกับระบบ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            กรุณาตรวจสอบการเชื่อมต่อกับ Firebase หรือรอข้อมูลจากระบบ
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-4">
            <p className="text-orange-700 dark:text-orange-300 text-sm">
              💡 ระบบจะอัพเดทข้อมูลอัตโนมัติเมื่อเชื่อมต่อสำเร็จ
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>สถานะ: {connectionStatus}</p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            🔄 ลองเชื่อมต่อใหม่
          </button>
        </div>
      </div>
    );
  }

  if (loading && !firebaseData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">กำลังโหลดแดชบอร์ด...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            กำลังเชื่อมต่อกับ Firebase...
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
            🐟 Fish Feeder Dashboard (Firebase)
          </h1>
          <div className="text-right text-sm">
            <div
              className={`font-semibold ${
                connectionStatus.includes("✅")
                  ? "text-green-600 dark:text-green-400"
                  : connectionStatus.includes("❌")
                    ? "text-red-600 dark:text-red-400"
                    : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {connectionStatus}
            </div>
            {lastUpdate && (
              <div className="text-gray-500 dark:text-gray-400">
                Last update: {lastUpdate}
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <strong>Source:</strong> Firebase Realtime Database |
          <strong
            className={`ml-2 ${isConnected ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
          >
            {isConnected ? "Live Data" : "Disconnected"}
          </strong>
          {loading && (
            <span className="ml-2 text-blue-500 dark:text-blue-400">🔄 Updating...</span>
          )}
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {summary.activeSensors}/{summary.totalSensors}
            </div>
            <div className="text-xs text-gray-500">Active Sensors</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {summary.freshData}
            </div>
            <div className="text-xs text-gray-500">Fresh Data</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {firebaseData?.status?.arduino_connected ? "✅" : "❌"}
            </div>
            <div className="text-xs text-gray-500">Arduino Status</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {summary.lastUpdate}
            </div>
            <div className="text-xs text-gray-500">Last Update</div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
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

            {/* Humidity & System Row */}
            <div className="col-span-12 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <WiHumidity className="mr-2 text-blue-500" />
                Humidity & System Monitoring
              </h2>
            </div>

            {/* Feeder Humidity */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Feeder Humidity
                  </span>
                  <WiHumidity className="text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {formatSensorValue(values.feederHumidity, "%")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.feederHumidity, 40, 70)}`}
                >
                  {values.feederHumidity &&
                  values.feederHumidity > 40 &&
                  values.feederHumidity < 70
                    ? "Normal"
                    : "Check"}
                </div>
              </div>
            </div>

            {/* System Humidity */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Humidity
                  </span>
                  <WiHumidity className="text-purple-500 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatSensorValue(values.systemHumidity, "%")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.systemHumidity, 40, 70)}`}
                >
                  {values.systemHumidity &&
                  values.systemHumidity > 40 &&
                  values.systemHumidity < 70
                    ? "Normal"
                    : "Check"}
                </div>
              </div>
            </div>

            {/* Food Weight */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Food Weight
                  </span>
                  <FaWeight className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {formatSensorValue(values.feederWeight, "g")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.feederWeight, 100, 1000)}`}
                >
                  {values.feederWeight && values.feederWeight > 100
                    ? "Sufficient"
                    : "Low Food"}
                </div>
              </div>
            </div>

            {/* Power & System Row */}
            <div className="col-span-12 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <BsLightningCharge className="mr-2 text-yellow-500" />
                Power & System Status
              </h2>
            </div>

            {/* Battery Status */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Battery
                  </span>
                  <BiBattery className="text-green-500 dark:text-green-400" />
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatSensorValue(values.batteryVoltage, "V")}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {formatSensorValue(values.batteryPercentage, "%")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.batteryPercentage, 20, 100)}`}
                >
                  {values.batteryPercentage && values.batteryPercentage > 20
                    ? "Good"
                    : "Low Battery"}
                </div>
              </div>
            </div>

            {/* Load Voltage */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Load Voltage
                  </span>
                  <BsLightningCharge className="text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {formatSensorValue(values.loadVoltage, "V")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.loadVoltage, 11, 14)}`}
                >
                  {values.loadVoltage &&
                  values.loadVoltage > 11 &&
                  values.loadVoltage < 14
                    ? "Normal"
                    : "Check"}
                </div>
              </div>
            </div>

            {/* Load Current */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Load Current
                  </span>
                  <BsLightningCharge className="text-red-500 dark:text-red-400" />
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {formatSensorValue(values.loadCurrent, "A")}
                </div>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  System Load
                </div>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="col-span-12 md:col-span-4 mt-4">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Soil Moisture
                  </span>
                  <WiHumidity className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {formatSensorValue(values.soilMoisture, "%")}
                </div>
                <div
                  className={`text-xs mt-1 ${getSensorStatusClass(values.soilMoisture, 30, 70)}`}
                >
                  {values.soilMoisture && values.soilMoisture > 30
                    ? "Moist"
                    : "Dry"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls (4 columns) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="space-y-6">
            {/* Device Control */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <BsToggleOn className="mr-2 text-blue-500" />
                Device Control
              </h2>

              <div className="space-y-4">
                {/* LED Control */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">LED Light</span>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                      onClick={() => controlLED("on")}
                    >
                      ON
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      onClick={() => controlLED("off")}
                    >
                      OFF
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                      onClick={() => controlLED("toggle")}
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* Fan Control */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fan</span>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                      onClick={() => controlFan("on")}
                    >
                      ON
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      onClick={() => controlFan("off")}
                    >
                      OFF
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                      onClick={() => controlFan("toggle")}
                    >
                      TOGGLE
                    </button>
                  </div>
                </div>

                {/* Emergency Control */}
                <div className="border-t pt-4">
                  <button
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
                    onClick={turnOffAll}
                  >
                    TURN OFF ALL DEVICES
                  </button>
                </div>
              </div>
            </div>

            {/* Arduino Commands */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Arduino Commands
              </h2>

              <div className="space-y-2">
                <button
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                  onClick={() => sendCommand("STATUS")}
                >
                  Get Status
                </button>
                <button
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm"
                  onClick={() => sendCommand("FEED_SMALL")}
                >
                  Feed Small
                </button>
                <button
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm"
                  onClick={() => sendCommand("FEED_MEDIUM")}
                >
                  Feed Medium
                </button>
                <button
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                  onClick={() => sendCommand("TARE_SCALE")}
                >
                  Tare Scale
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                System Status
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Firebase:</span>
                  <span className={isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Arduino:</span>
                  <span className={firebaseData?.status?.arduino_connected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {firebaseData?.status?.arduino_connected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                  <span className="text-gray-800 dark:text-gray-200">{summary.lastUpdate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Sensors:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {summary.activeSensors}/{summary.totalSensors}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseDashboard; 