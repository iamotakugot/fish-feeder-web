import { useState, useEffect, useCallback } from "react";
import { firebaseClient, FirebaseData, ArduinoSensorData } from "../config/firebase";

interface UseFirebaseSensorDataReturn {
  data: FirebaseData | null;
  sensorData: ArduinoSensorData | null;
  loading: boolean;
  error: string | null;
  lastUpdate: string;
  isConnected: boolean;
  controlLED: (action: "on" | "off" | "toggle") => Promise<boolean>;
  controlFan: (action: "on" | "off" | "toggle") => Promise<boolean>;
  turnOffAll: () => Promise<boolean>;
  sendCommand: (command: string) => Promise<boolean>;
}

export const useFirebaseSensorData = (): UseFirebaseSensorDataReturn => {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleDataUpdate = useCallback((firebaseData: FirebaseData | null) => {
    if (firebaseData) {
      setData(firebaseData);
      setIsConnected(firebaseData.status?.online || false);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
      console.log("✅ Firebase data updated:", firebaseData);
    } else {
      setError("No data received from Firebase");
      setIsConnected(false);
      console.log("❌ No Firebase data received");
    }
    setLoading(false);
  }, []);

  const controlLED = useCallback(async (action: "on" | "off" | "toggle"): Promise<boolean> => {
    try {
      const result = await firebaseClient.controlLED(action);
      console.log(`LED ${action} command sent:`, result);
      return result;
    } catch (error) {
      console.error("LED control failed:", error);
      return false;
    }
  }, []);

  const controlFan = useCallback(async (action: "on" | "off" | "toggle"): Promise<boolean> => {
    try {
      const result = await firebaseClient.controlFan(action);
      console.log(`Fan ${action} command sent:`, result);
      return result;
    } catch (error) {
      console.error("Fan control failed:", error);
      return false;
    }
  }, []);

  const turnOffAll = useCallback(async (): Promise<boolean> => {
    try {
      const result = await firebaseClient.turnOffAll();
      console.log("Turn off all command sent:", result);
      return result;
    } catch (error) {
      console.error("Turn off all failed:", error);
      return false;
    }
  }, []);

  const sendCommand = useCallback(async (command: string): Promise<boolean> => {
    try {
      const result = await firebaseClient.sendArduinoCommand(command);
      console.log(`Arduino command "${command}" sent:`, result);
      return result;
    } catch (error) {
      console.error("Arduino command failed:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    console.log("🔥 Starting Firebase listener...");
    const unsubscribe = firebaseClient.getSensorData(handleDataUpdate);

    return () => {
      console.log("🔥 Stopping Firebase listener...");
      unsubscribe();
    };
  }, [handleDataUpdate]);

  const sensorData = data?.sensors || null;

  return {
    data,
    sensorData,
    loading,
    error,
    lastUpdate,
    isConnected,
    controlLED,
    controlFan,
    turnOffAll,
    sendCommand,
  };
}; 