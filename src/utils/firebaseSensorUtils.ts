import { ArduinoSensorData, SensorValue } from "../config/firebase";

// Interface สำหรับแสดงผลใน Dashboard (compatible กับโค้ดเดิม)
export interface DashboardSensorValues {
  // Temperature sensors
  feederTemp: number | null;
  feederHumidity: number | null;
  systemTemp: number | null;
  systemHumidity: number | null;
  waterTemp: number | null;
  
  // System sensors
  feederWeight: number | null;
  weight: number | null; // alias for feederWeight for compatibility
  batteryVoltage: number | null;
  batteryPercentage: number | null;
  loadVoltage: number | null;
  loadCurrent: number | null;
  soilMoisture: number | null;
}

// แปลง Firebase data เป็นรูปแบบที่ Dashboard ใช้ได้
export function convertFirebaseToSensorValues(sensorData: ArduinoSensorData | null): DashboardSensorValues {
  if (!sensorData) {
    return {
      feederTemp: null,
      feederHumidity: null,
      systemTemp: null,
      systemHumidity: null,
      waterTemp: null,
      feederWeight: null,
      weight: null,
      batteryVoltage: null,
      batteryPercentage: null,
      loadVoltage: null,
      loadCurrent: null,
      soilMoisture: null,
    };
  }

  const feederWeight = sensorData.HX711_FEEDER?.weight?.value || null;
  
  return {
    // Temperature sensors
    feederTemp: sensorData.DHT22_FEEDER?.temperature?.value || null,
    feederHumidity: sensorData.DHT22_FEEDER?.humidity?.value || null,
    systemTemp: sensorData.DHT22_SYSTEM?.temperature?.value || null,
    systemHumidity: sensorData.DHT22_SYSTEM?.humidity?.value || null,
    waterTemp: sensorData.DS18B20_WATER_TEMP?.temperature?.value || null,
    
    // System sensors
    feederWeight,
    weight: feederWeight, // alias for compatibility
    batteryVoltage: sensorData.BATTERY_STATUS?.voltage?.value || null,
    batteryPercentage: sensorData.BATTERY_STATUS?.percentage?.value || null,
    loadVoltage: sensorData.LOAD_VOLTAGE?.voltage?.value || null,
    loadCurrent: sensorData.LOAD_CURRENT?.current?.value || null,
    soilMoisture: sensorData.SOIL_MOISTURE?.moisture?.value || null,
  };
}

// Format sensor value สำหรับแสดงผล
export function formatSensorValue(value: number | null, unit: string = ""): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  // Handle different types of values
  if (unit === "°C") {
    return `${value.toFixed(1)}°C`;
  } else if (unit === "%") {
    return `${value.toFixed(1)}%`;
  } else if (unit === "V") {
    return `${value.toFixed(2)}V`;
  } else if (unit === "A") {
    return `${value.toFixed(3)}A`;
  } else if (unit === "g") {
    return `${value.toFixed(1)}g`;
  }

  return `${value.toFixed(2)}${unit}`;
}

// Get sensor status class สำหรับสี
export function getSensorStatusClass(value: number | null, minGood: number, maxGood: number): string {
  if (value === null || value === undefined) {
    return "text-gray-500 dark:text-gray-400";
  }

  if (value >= minGood && value <= maxGood) {
    return "text-green-600 dark:text-green-400";
  } else {
    return "text-red-600 dark:text-red-400";
  }
}

// ตรวจสอบว่า sensor มีข้อมูลหรือไม่
export function hasSensorData(sensorData: ArduinoSensorData | null): boolean {
  if (!sensorData) return false;

  return (
    sensorData.DHT22_SYSTEM ||
    sensorData.DHT22_FEEDER ||
    sensorData.DS18B20_WATER_TEMP ||
    sensorData.HX711_FEEDER ||
    sensorData.BATTERY_STATUS ||
    sensorData.LOAD_VOLTAGE ||
    sensorData.LOAD_CURRENT ||
    sensorData.SOIL_MOISTURE
  ) !== undefined;
}

// Get timestamp from sensor value
export function getSensorTimestamp(sensorValue: SensorValue | undefined): string {
  if (!sensorValue?.timestamp) {
    return "No timestamp";
  }

  try {
    const date = new Date(sensorValue.timestamp);
    return date.toLocaleTimeString();
  } catch (error) {
    return "Invalid timestamp";
  }
}

// ตรวจสอบว่า sensor data เป็นข้อมูลใหม่หรือไม่ (ใน 5 นาทีที่ผ่านมา)
export function isSensorDataFresh(sensorValue: SensorValue | undefined): boolean {
  if (!sensorValue?.timestamp) return false;

  try {
    const sensorTime = new Date(sensorValue.timestamp);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return sensorTime > fiveMinutesAgo;
  } catch (error) {
    return false;
  }
}

// สร้าง summary ของ sensor data
export function getSensorSummary(sensorData: ArduinoSensorData | null): {
  totalSensors: number;
  activeSensors: number;
  freshData: number;
  lastUpdate: string;
} {
  if (!sensorData) {
    return {
      totalSensors: 0,
      activeSensors: 0,
      freshData: 0,
      lastUpdate: "No data",
    };
  }

  const sensors = [
    sensorData.DHT22_SYSTEM?.temperature,
    sensorData.DHT22_SYSTEM?.humidity,
    sensorData.DHT22_FEEDER?.temperature,
    sensorData.DHT22_FEEDER?.humidity,
    sensorData.DS18B20_WATER_TEMP?.temperature,
    sensorData.HX711_FEEDER?.weight,
    sensorData.BATTERY_STATUS?.voltage,
    sensorData.BATTERY_STATUS?.percentage,
    sensorData.LOAD_VOLTAGE?.voltage,
    sensorData.LOAD_CURRENT?.current,
    sensorData.SOIL_MOISTURE?.moisture,
  ];

  const totalSensors = sensors.length;
  const activeSensors = sensors.filter(sensor => sensor?.value !== undefined).length;
  const freshData = sensors.filter(sensor => isSensorDataFresh(sensor)).length;

  // หา timestamp ล่าสุด
  const timestamps = sensors
    .filter(sensor => sensor?.timestamp)
    .map(sensor => new Date(sensor!.timestamp))
    .sort((a, b) => b.getTime() - a.getTime());

  const lastUpdate = timestamps.length > 0 
    ? timestamps[0].toLocaleTimeString()
    : "No data";

  return {
    totalSensors,
    activeSensors,
    freshData,
    lastUpdate,
  };
} 