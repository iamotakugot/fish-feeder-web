import React from "react";
import { FaTemperatureHigh, FaWeight, FaBatteryThreeQuarters } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoWaterOutline } from "react-icons/io5";
import { BsLightningCharge, BsSun } from "react-icons/bs";
import { GiWateringCan } from "react-icons/gi";
import { convertFirebaseToSensorValues, formatSensorValue, DashboardSensorValues } from "../utils/firebaseSensorUtils";
import { ArduinoSensorData } from "../config/firebase";

interface DashboardSensorPanelProps {
  sensorData: ArduinoSensorData;
  lastUpdate: string;
}

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  unit: string;
  bgColor: string;
  iconColor: string;
  lastUpdate?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ 
  icon, 
  label, 
  value, 
  unit, 
  bgColor, 
  iconColor,
  lastUpdate 
}) => {
  const displayValue = value !== null && value !== undefined 
    ? typeof value === 'number' 
      ? value.toFixed(1) 
      : value.toString()
    : "--";

  return (
    <div className={`${bgColor} rounded-lg p-4 border shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {displayValue}{displayValue !== "--" ? unit : ""}
      </div>
      {lastUpdate && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          อัพเดท: {lastUpdate}
        </div>
      )}
    </div>
  );
};

// Development example data generator (remove in production)
function generateExampleData(): DashboardSensorValues {
  const now = new Date();
  const temp = 25 + Math.sin(now.getTime() / 30000) * 5; // temperature oscillation
  const humidity = 60 + Math.sin(now.getTime() / 20000 + 1) * 15; // humidity oscillation
  
  return {
    feederTemp: 25.3 + Math.random() * 3,
    feederHumidity: 64.2 + Math.random() * 10,
    systemTemp: 32.1 + Math.random() * 2,
    systemHumidity: 58.5 + Math.random() * 8,
    waterTemp: 27.3 + Math.random() * 1.5,
    feederWeight: 1384.2 + Math.random() * 100,
    weight: 1384.2 + Math.random() * 100,
    batteryVoltage: 12.5 + Math.random() * 0.5,
    batteryPercentage: 82 + Math.random() * 15,
    loadVoltage: 12.1 + Math.random() * 0.3,
    loadCurrent: 0.3 + Math.random() * 0.2,
    soilMoisture: 44.2 + Math.random() * 10,
  };
}

const DashboardSensorPanel: React.FC<DashboardSensorPanelProps> = ({ 
  sensorData, 
  lastUpdate 
}) => {
  const values = convertFirebaseToSensorValues(sensorData);
  
  // Use example data if no real data available (for development)
  const displayValues = Object.values(values).some(v => v !== null) 
    ? values 
    : generateExampleData();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            🐟 Fish Feeder Dashboard
          </h1>
          <div className="text-right text-sm">
            <div className="font-semibold text-green-600 dark:text-green-400">
              ✅ เชื่อมต่อ Firebase แล้ว - ข้อมูลสด
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              อัพเดทล่าสุด: {lastUpdate}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <strong>แหล่งข้อมูล:</strong> Firebase Realtime Database |
          <strong className="ml-2 text-green-600 dark:text-green-400">
            ข้อมูลแบบ Real-time
          </strong>
          {Object.values(values).every(v => v === null) && (
            <span className="ml-2 text-orange-600 dark:text-orange-400">
              (ใช้ข้อมูลจำลองสำหรับทดสอบ)
            </span>
          )}
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feed Temperature & Humidity (DHT22 - ถังอาหาร) */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feed Temp & Humidity
            </span>
            <FaTemperatureHigh className="text-red-500 dark:text-red-400 text-xl" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-red-700 dark:text-red-300">
              {formatSensorValue(displayValues.feederTemp, "°C")}
            </div>
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-300">
              {formatSensorValue(displayValues.feederHumidity, "%")}
            </div>
          </div>
        </div>

        {/* System Temperature & Humidity (DHT22 - ตู้ควบคุม) */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              System Temp & Humidity
            </span>
            <FaTemperatureHigh className="text-blue-500 dark:text-blue-400 text-xl" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {formatSensorValue(displayValues.systemTemp, "°C")}
            </div>
            <div className="text-lg font-semibold text-cyan-600 dark:text-cyan-300">
              {formatSensorValue(displayValues.systemHumidity, "%")}
            </div>
          </div>
        </div>

        {/* Water Temperature (DS18B20) */}
        <SensorCard
          icon={<IoWaterOutline className="text-xl" />}
          label="Water Temperature"
          value={displayValues.waterTemp}
          unit="°C"
          bgColor="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border-teal-200 dark:border-teal-700"
          iconColor="text-teal-500 dark:text-teal-400"
        />

        {/* Feed Weight (HX711) */}
        <SensorCard
          icon={<FaWeight className="text-xl" />}
          label="Feed Weight"
          value={displayValues.feederWeight}
          unit="g"
          bgColor="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700"
          iconColor="text-purple-500 dark:text-purple-400"
        />

        {/* Pellet Humidity (Soil Moisture) */}
        <SensorCard
          icon={<GiWateringCan className="text-xl" />}
          label="Pellet Humidity"
          value={displayValues.soilMoisture}
          unit="%"
          bgColor="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700"
          iconColor="text-green-500 dark:text-green-400"
        />

        {/* Load Voltage */}
        <SensorCard
          icon={<BsSun className="text-xl" />}
          label="Load Voltage"
          value={displayValues.loadVoltage}
          unit="V"
          bgColor="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700"
          iconColor="text-yellow-500 dark:text-yellow-400"
        />

        {/* Load Current */}
        <SensorCard
          icon={<BsLightningCharge className="text-xl" />}
          label="Load Current"
          value={displayValues.loadCurrent}
          unit="A"
          bgColor="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700"
          iconColor="text-orange-500 dark:text-orange-400"
        />

        {/* Battery Voltage */}
        <SensorCard
          icon={<FaBatteryThreeQuarters className="text-xl" />}
          label="Battery Voltage"
          value={displayValues.batteryVoltage}
          unit="V"
          bgColor="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700"
          iconColor="text-indigo-500 dark:text-indigo-400"
        />

        {/* Battery Level */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Battery Level
            </span>
            <FaBatteryThreeQuarters className="text-emerald-500 dark:text-emerald-400 text-xl" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {displayValues.batteryPercentage !== null && displayValues.batteryPercentage !== undefined 
              ? `${displayValues.batteryPercentage.toFixed(0)}%` 
              : "--"}
          </div>
          {displayValues.batteryPercentage !== null && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(displayValues.batteryPercentage || 0, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-300">
            🔄 ระบบอัพเดทข้อมูลอัตโนมัติทุก 3 วินาที
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            📡 Firebase Realtime Database
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSensorPanel; 