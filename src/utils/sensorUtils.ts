import { AllSensorsResponse, SensorValue, API_CONFIG } from "../config/api";

// Type guard to check if value is a number
export const isValidNumber = (value: any): value is number => {
  return typeof value === "number" && !isNaN(value);
};

// Extract sensor value safely
export const extractSensorValue = (
  sensorData: any,
  valueType: string,
): number | null => {
  if (!sensorData?.values || !Array.isArray(sensorData.values)) {
    return null;
  }

  const valueObj = sensorData.values.find(
    (v: SensorValue) => v.type === valueType,
  );

  if (!valueObj) return null;

  return isValidNumber(valueObj.value) ? valueObj.value : null;
};

// Get sensors from response (handle both old and new API structure)
export const getSensorsFromResponse = (
  response: AllSensorsResponse | null,
): Record<string, any> | null => {
  if (!response) return null;

  // New API structure
  if ("data" in response && response.data) {
    return response.data;
  }

  // Legacy structure (if exists)
  if ("sensors" in response && response.sensors) {
    return response.sensors as Record<string, any>;
  }

  return null;
};

// Extract all current sensor values safely
export const getCurrentSensorValues = (
  sensorsData: AllSensorsResponse | null,
) => {
  const sensors = getSensorsFromResponse(sensorsData);

  if (!sensors) {
    return null;
  }

  return {
    feederTemp: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.DHT22_FEEDER],
      "temperature",
    ),
    feederHumidity: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.DHT22_FEEDER],
      "humidity",
    ),
    systemTemp: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.DHT22_SYSTEM],
      "temperature",
    ),
    systemHumidity: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.DHT22_SYSTEM],
      "humidity",
    ),
    waterTemp: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.DS18B20_WATER_TEMP],
      "temperature",
    ),
    weight: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.HX711_FEEDER],
      "weight",
    ),
    loadVoltage: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.LOAD_VOLTAGE],
      "voltage",
    ),
    loadCurrent: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.LOAD_CURRENT],
      "current",
    ),
    batteryPercentage: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.BATTERY_STATUS],
      "percentage",
    ),
    batteryCharging: extractSensorValue(
      sensors[API_CONFIG.SENSOR_NAMES.BATTERY_STATUS],
      "charging",
    ),
  };
};

// Format sensor value for display
export const formatSensorValue = (
  value: number | null,
  unit: string = "",
  decimals: number = 1,
): string => {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value.toFixed(decimals)}${unit}`;
};

// Get status class based on value and thresholds
export const getSensorStatusClass = (
  value: number | null,
  minGood?: number,
  maxGood?: number,
): string => {
  if (value === null) return "text-gray-500";

  if (minGood !== undefined && maxGood !== undefined) {
    return value >= minGood && value <= maxGood
      ? "text-green-600"
      : "text-yellow-600";
  }

  return "text-blue-600";
};

// Check if sensors data is fresh (within last 30 seconds)
export const isSensorDataFresh = (
  response: AllSensorsResponse | null,
): boolean => {
  if (!response) return false;

  const timestamp =
    typeof response.timestamp === "string"
      ? new Date(response.timestamp).getTime()
      : response.timestamp || Date.now();
  const age = Date.now() - timestamp;

  return age < 30000; // 30 seconds
};
