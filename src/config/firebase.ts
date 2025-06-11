// Firebase configuration and client
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  Database,
  ref,
  set,
  onValue,
  off,
} from "firebase/database";

// Firebase configuration (Updated for fish-feeder-test-1)
const firebaseConfig = {
  apiKey: "AIzaSyDDJOzZOzNJoWmTNbHVGAL0-5KPQNcr8iY",
  authDomain: "fish-feeder-test-1.firebaseapp.com",
  databaseURL: "https://fish-feeder-test-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fish-feeder-test-1",
  storageBucket: "fish-feeder-test-1.firebasestorage.app",
  messagingSenderId: "965648166404",
  appId: "1:965648166404:web:9a8e0c5c8be5b2e4b5f9e8",
};

// Types for Arduino sensor data
export interface SensorValue {
  value: number;
  unit: string;
  timestamp: string;
}

export interface ArduinoSensorData {
  DHT22_SYSTEM?: {
    temperature: SensorValue;
    humidity: SensorValue;
  };
  DHT22_FEEDER?: {
    temperature: SensorValue;
    humidity: SensorValue;
  };
  DS18B20_WATER_TEMP?: {
    temperature: SensorValue;
  };
  HX711_FEEDER?: {
    weight: SensorValue;
  };
  BATTERY_STATUS?: {
    voltage: SensorValue;
    percentage: SensorValue;
  };
  LOAD_VOLTAGE?: {
    voltage: SensorValue;
  };
  LOAD_CURRENT?: {
    current: SensorValue;
  };
  SOIL_MOISTURE?: {
    moisture: SensorValue;
  };
}

export interface FirebaseRelayStatus {
  led: boolean;
  fan: boolean;
}

export interface FirebaseStatus {
  online: boolean;
  relay: FirebaseRelayStatus;
  response_time_ms?: string;
}

export interface FirebaseData {
  timestamp: string;
  sensors: ArduinoSensorData;
  status: {
    online: boolean;
    last_updated: string;
    arduino_connected: boolean;
  };
  control?: {
    led?: string;
    fan?: string;
  };
}

// Firebase client class
class FirebaseClient {
  private app: FirebaseApp;
  private database: Database;

  constructor() {
    // Initialize Firebase app only if it doesn't exist
    if (getApps().length === 0) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    this.database = getDatabase(this.app);
  }

  // Get real-time sensor data updates
  getSensorData(callback: (data: FirebaseData | null) => void): () => void {
    const sensorsRef = ref(this.database, "fish_feeder");

    const unsubscribe = onValue(
      sensorsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          callback(data as FirebaseData);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Firebase sensor data listener error:", error);
        callback(null);
      },
    );

    return () => off(sensorsRef, "value", unsubscribe);
  }

  // Get real-time status updates (legacy compatibility)
  getStatus(callback: (status: any | null) => void): () => void {
    const statusRef = ref(this.database, "fish_feeder/status");

    const unsubscribe = onValue(
      statusRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Firebase status listener error:", error);
        callback(null);
      },
    );

    return () => off(statusRef, "value", unsubscribe);
  }

  // Control LED
  async controlLED(action: "on" | "off" | "toggle"): Promise<boolean> {
    try {
      const controlRef = ref(this.database, "fish_feeder/control/led");

      await set(controlRef, action);

      return true;
    } catch (error) {
      console.error("LED control error:", error);

      return false;
    }
  }

  // Control Fan
  async controlFan(action: "on" | "off" | "toggle"): Promise<boolean> {
    try {
      const controlRef = ref(this.database, "fish_feeder/control/fan");

      await set(controlRef, action);

      return true;
    } catch (error) {
      console.error("Fan control error:", error);

      return false;
    }
  }

  // Turn off all devices
  async turnOffAll(): Promise<boolean> {
    try {
      const controlRef = ref(this.database, "fish_feeder/control");

      await set(controlRef, {
        led: "off",
        fan: "off",
      });

      return true;
    } catch (error) {
      console.error("Turn off all error:", error);

      return false;
    }
  }

  // Send command to Arduino
  async sendArduinoCommand(command: string): Promise<boolean> {
    try {
      const commandRef = ref(this.database, "fish_feeder/commands");

      await set(commandRef, {
        command: command,
        timestamp: new Date().toISOString(),
        status: "pending"
      });

      return true;
    } catch (error) {
      console.error("Arduino command error:", error);

      return false;
    }
  }
}

// Export singleton instance
export const firebaseClient = new FirebaseClient();
