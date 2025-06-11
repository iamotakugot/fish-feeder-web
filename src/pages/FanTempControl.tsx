import { useState, useEffect } from "react";
import { Slider } from "@heroui/slider";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { FaTemperatureHigh, FaFan } from "react-icons/fa";
import { HiStatusOnline } from "react-icons/hi";
import { RiBlazeFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { Input } from "@heroui/input";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

import {
  API_CONFIG,
  FishFeederApiClient,
  BlowerControlRequest,
} from "../config/api";

// Define the SliderStepMark type based on HeroUI docs
type SliderStepMark = {
  value: number;
  label: string;
};

const FanTempControl = () => {
  // States for fan control
  const [systemTemperature, setSystemTemperature] = useState(25); // Actual current temperature from DHT22_SYSTEM
  const [feederTemperature, setFeederTemperature] = useState(25); // Temperature from DHT22_FEEDER
  const [temperatureThreshold, setTemperatureThreshold] = useState(30); // Fan activation threshold
  const [autoFanMode, setAutoFanMode] = useState(true);
  const [fanStatus, setFanStatus] = useState(false);
  const [blowerSpeed, setBlowerSpeed] = useState(100);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [apiClient] = useState(new FishFeederApiClient());
  const [tempThreshold, setTempThreshold] = useState(30);
  const [hysteresis, setHysteresis] = useState(2);
  const [updateInterval, setUpdateInterval] = useState(3);
  const [tempHistory, setTempHistory] = useState<any[]>([
    { time: "12:00", feederTemp: 25, systemTemp: 23, threshold: 30 },
    { time: "13:00", feederTemp: 26, systemTemp: 24, threshold: 30 },
    { time: "14:00", feederTemp: 28, systemTemp: 25, threshold: 30 },
  ]);

  // Define slider marks
  const temperatureMarks: SliderStepMark[] = [
    { value: 20, label: "20°C" },
    { value: 25, label: "25°C" },
    { value: 30, label: "30°C" },
    { value: 35, label: "35°C" },
    { value: 40, label: "40°C" },
  ];

  const speedMarks: SliderStepMark[] = [
    { value: 0, label: "0%" },
    { value: 50, label: "50%" },
    { value: 100, label: "100%" },
    { value: 150, label: "150%" },
    { value: 200, label: "200%" },
    { value: 255, label: "255%" },
  ];

  // Fetch temperature data from Pi server
  const fetchTemperatureData = async () => {
    try {
      // Get DHT22_SYSTEM data (control box temperature)
      const systemSensor = await apiClient.getSensor(
        API_CONFIG.SENSOR_NAMES.DHT22_SYSTEM,
      );
      const systemTemp = systemSensor.values.find(
        (v) => v.type === "temperature",
      );

      if (systemTemp && typeof systemTemp.value === "number") {
        setSystemTemperature(systemTemp.value);
      }

      // Get DHT22_FEEDER data (feeder bucket temperature)
      const feederSensor = await apiClient.getSensor(
        API_CONFIG.SENSOR_NAMES.DHT22_FEEDER,
      );
      const feederTemp = feederSensor.values.find(
        (v) => v.type === "temperature",
      );

      if (feederTemp && typeof feederTemp.value === "number") {
        setFeederTemperature(feederTemp.value);
      }

      setConnectionStatus("✅ Connected to Pi Server");
    } catch (error) {
      console.error("Failed to fetch temperature data:", error);
      setConnectionStatus("❌ Mock Data");

      // Simulate temperature changes for demo
      setSystemTemperature((prev) => {
        const fluctuation = (Math.random() - 0.5) * 0.5;

        return Math.round((prev + fluctuation) * 10) / 10;
      });
      setFeederTemperature((prev) => {
        const fluctuation = (Math.random() - 0.5) * 0.3;

        return Math.round((prev + fluctuation) * 10) / 10;
      });
    }
  };

  // Effect to control fan based on temperature when in auto mode
  useEffect(() => {
    if (autoFanMode) {
      // Use the higher of the two temperatures for fan control
      const maxTemp = Math.max(systemTemperature, feederTemperature);
      const shouldActivate = maxTemp >= temperatureThreshold;

      if (shouldActivate !== fanStatus) {
        setFanStatus(shouldActivate);
        // Auto control the blower based on temperature
        if (shouldActivate) {
          handleBlowerControl("start");
        } else {
          handleBlowerControl("stop");
        }
      }
    }
  }, [
    systemTemperature,
    feederTemperature,
    temperatureThreshold,
    autoFanMode,
    fanStatus,
  ]);

  // Fetch temperature data on component mount and set interval
  useEffect(() => {
    fetchTemperatureData();
    const interval = setInterval(
      fetchTemperatureData,
      API_CONFIG.REFRESH_INTERVALS.SENSORS,
    );

    return () => clearInterval(interval);
  }, []);

  // Handle blower control via Pi server API
  const handleBlowerControl = async (
    action: BlowerControlRequest["action"],
    value?: number,
  ) => {
    try {
      setLoading(true);
      const request: BlowerControlRequest = { action };

      if (value !== undefined) {
        request.value = value;
      }

      const response = await apiClient.controlBlower(request);

      console.log(`Blower ${action} response:`, response);

      if (response.status === "success") {
        if (action === "start") {
          setFanStatus(true);
        } else if (action === "stop") {
          setFanStatus(false);
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} blower:`, error);
      // Update local state anyway for demo purposes
      if (action === "start") {
        setFanStatus(true);
      } else if (action === "stop") {
        setFanStatus(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle manual fan toggle
  const handleManualFanToggle = async () => {
    if (!autoFanMode) {
      const action = fanStatus ? "stop" : "start";

      await handleBlowerControl(action);
    }
  };

  // Handle speed change
  const handleSpeedChange = async (newSpeed: number) => {
    setBlowerSpeed(newSpeed);
    if (fanStatus) {
      await handleBlowerControl("speed", newSpeed);
    }
  };

  const loadTemperatureData = async () => {
    try {
      // Mock temperature history data
      const mockHistory = [
        { time: "12:00", feederTemp: 25, systemTemp: 23, threshold: tempThreshold },
        { time: "13:00", feederTemp: 26, systemTemp: 24, threshold: tempThreshold },
        { time: "14:00", feederTemp: 28, systemTemp: 25, threshold: tempThreshold },
        { time: "15:00", feederTemp: 30, systemTemp: 27, threshold: tempThreshold },
        { time: "16:00", feederTemp: 32, systemTemp: 29, threshold: tempThreshold },
      ];
      setTempHistory(mockHistory);
    } catch (error) {
      console.error("Failed to load temperature history:", error);
    }
  };

  useEffect(() => {
    loadTemperatureData();
  }, [tempThreshold]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <FaTemperatureHigh className="mr-3 text-orange-500" />
          Fan & Temperature Control
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Automated temperature monitoring and fan control system
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HiStatusOnline className="mr-2 text-green-500" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Connection Status</div>
              <div
                className={`font-semibold ${
                  connectionStatus.includes("✅")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {connectionStatus}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Auto Update: {API_CONFIG.REFRESH_INTERVALS.SENSORS / 1000}s
          </div>
        </div>
      </div>

      {/* Temperature Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Temperature */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaTemperatureHigh className="text-red-500 mr-2 text-xl" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                System Temperature
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">DHT22_SYSTEM</div>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {systemTemperature.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Control box ambient temperature
          </div>
        </div>

        {/* Feeder Temperature */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaTemperatureHigh className="text-orange-500 mr-2 text-xl" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Feeder Temperature
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">DHT22_FEEDER</div>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {feederTemperature.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Feed bucket internal temperature
          </div>
        </div>
      </div>

      {/* Fan Control Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center text-blue-500 dark:text-blue-400 mb-6">
          <FaFan className="mr-2 text-xl" />
          <span className="text-lg font-medium">Cooling Fan Control</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fan Settings */}
          <div className="space-y-6">
            {/* Auto Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  Automatic Mode
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Fan controlled by temperature threshold
                </div>
              </div>
              <Switch
                isSelected={autoFanMode}
                onValueChange={setAutoFanMode}
                size="lg"
                color="primary"
              />
            </div>

            {/* Temperature Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900 dark:text-gray-100">
                  Temperature Threshold
                </label>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {temperatureThreshold}°C
                </span>
              </div>
              <Slider
                size="lg"
                step={0.5}
                marks={temperatureMarks}
                minValue={20}
                maxValue={40}
                value={temperatureThreshold}
                onChange={(value) => setTemperatureThreshold(value as number)}
                className="w-full"
                color="warning"
                isDisabled={!autoFanMode}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Fan will start when temperature exceeds this threshold
              </div>
            </div>

            {/* Manual Fan Control */}
            {!autoFanMode && (
              <div className="space-y-3">
                <label className="font-medium text-gray-900 dark:text-gray-100">
                  Manual Fan Control
                </label>
                <Button
                  size="lg"
                  color={fanStatus ? "danger" : "primary"}
                  variant={fanStatus ? "solid" : "bordered"}
                  onPress={handleManualFanToggle}
                  isLoading={loading}
                  className="w-full"
                >
                  <FaFan className="mr-2" />
                  {fanStatus ? "Turn Fan OFF" : "Turn Fan ON"}
                </Button>
              </div>
            )}

            {/* Fan Speed Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-900 dark:text-gray-100">
                  Fan Speed
                </label>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {blowerSpeed} ({Math.round(blowerSpeed * 2.55)}/255)
                </span>
              </div>
              <Slider
                size="lg"
                step={5}
                marks={speedMarks}
                minValue={0}
                maxValue={255}
                value={blowerSpeed}
                onChange={(value) => handleSpeedChange(value as number)}
                className="w-full"
                color="primary"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                PWM speed control (0-255)
              </div>
            </div>
          </div>

          {/* Fan Status */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <FaFan
                className={`mx-auto text-6xl mb-4 ${
                  fanStatus
                    ? "text-green-500 animate-spin"
                    : "text-gray-400"
                }`}
              />
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Fan Status: {fanStatus ? "RUNNING" : "STOPPED"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {autoFanMode ? "Auto Mode" : "Manual Mode"}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                size="sm"
                color="secondary"
                variant="bordered"
                onPress={() => fetchTemperatureData()}
                isLoading={loading}
                className="w-full"
              >
                <HiStatusOnline className="mr-2" />
                Refresh Temperature
              </Button>
              
              <Button
                size="sm"
                color="warning"
                variant="bordered"
                onPress={() => handleBlowerControl("stop")}
                isLoading={loading}
                className="w-full"
              >
                <RiBlazeFill className="mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center text-purple-500 dark:text-purple-400 mb-6">
          <IoMdSettings className="mr-2 text-xl" />
          <span className="text-lg font-medium">Advanced Temperature Settings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Temperature Threshold (°C)
            </label>
            <Input
              type="number"
              value={tempThreshold.toString()}
              onChange={(e) => setTempThreshold(Number(e.target.value))}
              min={20}
              max={50}
              step={0.5}
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hysteresis (°C)
            </label>
            <Input
              type="number"
              value={hysteresis.toString()}
              onChange={(e) => setHysteresis(Number(e.target.value))}
              min={0.5}
              max={5}
              step={0.5}
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Update Interval (seconds)
            </label>
            <Input
              type="number"
              value={updateInterval.toString()}
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
              min={1}
              max={60}
              step={1}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Temperature History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Temperature History
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tempHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="feederTemp"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Feeder Temp"
              />
              <Line
                type="monotone"
                dataKey="systemTemp"
                stroke="#ef4444"
                strokeWidth={2}
                name="System Temp"
              />
              <Line
                type="monotone"
                dataKey="threshold"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Threshold"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FanTempControl; 