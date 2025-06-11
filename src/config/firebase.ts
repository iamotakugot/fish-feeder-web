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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDJOzZOzNJoWmTNbHVGAL0-5KPQNcr8iY",
  authDomain: "iee-fish-feeder.firebaseapp.com",
  databaseURL:
    "https://iee-fish-feeder-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iee-fish-feeder",
  storageBucket: "iee-fish-feeder.firebasestorage.app",
  messagingSenderId: "965648166404",
  appId: "1:965648166404:web:9a8e0c5c8be5b2e4b5f9e8",
};

// Types
export interface FirebaseStatus {
  online: boolean;
  response_time_ms: string;
  relay: FirebaseRelayStatus;
}

export interface FirebaseRelayStatus {
  led: boolean;
  fan: boolean;
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

  // Get real-time status updates
  getStatus(callback: (status: FirebaseStatus | null) => void): () => void {
    const statusRef = ref(this.database, "status");

    const unsubscribe = onValue(
      statusRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          callback(data as FirebaseStatus);
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
      const controlRef = ref(this.database, "control/led");

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
      const controlRef = ref(this.database, "control/fan");

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
      const controlRef = ref(this.database, "control");

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
}

// Export singleton instance
export const firebaseClient = new FirebaseClient();
