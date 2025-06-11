/**
 * API Configuration for Fish Feeder Web App
 * Connects to Pi Server (Flask) Backend API
 * Updated for performance optimization and better error handling
 */

export const API_CONFIG = {
  // Base URL for the Pi Server API
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",

  // API Endpoints (Updated for new backend)
  ENDPOINTS: {
    // Core endpoints
    HEALTH: "/health",
    SENSORS: "/api/sensors",
    SENSOR_BY_NAME: "/api/sensors", // Will append /{sensor_name}

    // Device Control endpoints (Updated for new server)
    CONTROL_DIRECT: "/api/control/direct",

    // Relay Control endpoints (NEW)
    RELAY_STATUS: "/api/relay/status",
    RELAY_LED: "/api/relay/led",
    RELAY_FAN: "/api/relay/fan",

    // ULTRA FAST Control (NEW)
    CONTROL_ULTRA: "/api/control/ultra",

    // Legacy endpoints (may not be implemented yet)
    CONTROL_BLOWER: "/api/control/blower",
    CONTROL_ACTUATOR: "/api/control/actuator",
    CONTROL_FEED: "/api/control/feed",
    CONTROL_CONFIG: "/api/control/config",

    // Weight calibration endpoints
    WEIGHT_CALIBRATE: "/api/control/weight/calibrate",
    WEIGHT_TARE: "/api/control/weight/tare",
    WEIGHT_RESET: "/api/control/weight/reset",

    // Camera endpoints
    VIDEO_FEED: "/api/camera/video_feed",
    PHOTO: "/api/camera/photo",
    RECORD_START: "/api/camera/record/start",
    RECORD_STOP: "/api/camera/record/stop",

    // Feed history endpoints
    FEED_HISTORY: "/api/feed/history",
    FEED_HISTORY_FILTER: "/api/feed/history/filter",
    FEED_STATISTICS: "/api/feed/statistics",
    FEED_SESSION: "/api/feed/session", // Will append /{session_id}

    // Firebase sync
    SYNC: "/api/sensors/sync",
  },

  // Optimized timeouts for better performance
  TIMEOUT: 5000, // Increased from 300ms to 5s for stability
  FAST_TIMEOUT: 1000, // For quick operations

  // Cache settings
  CACHE_DURATION: 30000, // 30 seconds cache for sensor data

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Refresh intervals optimized for performance
  REFRESH_INTERVALS: {
    SENSORS: 5000, // 5 seconds (reduced frequency)
    STATUS: 3000, // 3 seconds
    FAST_STATUS: 1000, // 1 second for ultra-fast operations
    SLOW_STATUS: 10000, // 10 seconds for less critical data
  },

  // Sensor name mappings (for backward compatibility)
  SENSOR_NAMES: {
    // Temperature sensors
    DHT22_SYSTEM: "DHT22_SYSTEM",
    DHT22_FEEDER: "DHT22_FEEDER",
    DS18B20_WATER_TEMP: "DS18B20_WATER_TEMP",

    // Weight sensors
    HX711_FEEDER: "HX711_FEEDER",
    HX711_FOOD_WEIGHT: "HX711_FOOD_WEIGHT",

    // System sensors
    BATTERY_STATUS: "BATTERY_STATUS",
    LOAD_VOLTAGE: "LOAD_VOLTAGE",
    LOAD_CURRENT: "LOAD_CURRENT",
    SOLAR_CURRENT: "LOAD_CURRENT", // Legacy alias
    SOIL_MOISTURE: "SOIL_MOISTURE",
  },

  // HTTP Methods
  METHODS: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
  },

  // Response status codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
};

// Performance-optimized cache implementation
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private maxSize = 100; // Prevent memory leaks

  set(
    key: string,
    data: any,
    duration: number = API_CONFIG.CACHE_DURATION,
  ): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data: JSON.parse(JSON.stringify(data)), // Deep clone to prevent mutations
      timestamp: Date.now() + duration,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);

      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) return false;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);

      return false;
    }

    return true;
  }
}

// Create global cache instance
const apiCache = new SimpleCache();

// Enhanced error handling
export class ApiError extends Error {
  public status: number;
  public endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

// Request timeout helper
const withTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout),
    ),
  ]);
};

// Retry helper with exponential backoff
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
  delay: number = API_CONFIG.RETRY_DELAY,
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries) break;

      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};

// Rest of the existing API interfaces and client code...
// (keeping the existing interfaces and FishFeederApiClient implementation)

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  server_info: {
    version: string;
    uptime: number;
  };
  serial_connected: boolean;
  sensors_available: string[];
}

export interface SensorReading {
  sensor_name: string;
  timestamp: string;
  values: Array<{
    type: string;
    value: number;
    unit: string;
  }>;
}

export interface AllSensorsResponse {
  status: string;
  timestamp: string;
  data: {
    [sensorName: string]: SensorReading;
  };
}

export interface ApiResponse {
  status: string;
  message?: string;
  data?: any;
  timestamp?: string;
}

// Relay Status interfaces
export interface RelayStatus {
  led: boolean;
  fan: boolean;
}

export interface RelayStatusResponse extends ApiResponse {
  relay_status: RelayStatus;
}

// Control request interfaces
export interface BlowerControlRequest {
  action: "start" | "stop" | "speed";
  speed?: number; // 0-255 for PWM speed control
  value?: number; // Legacy support for value parameter
}

export interface ActuatorControlRequest {
  action: "extend" | "retract" | "stop" | "up" | "down"; // Legacy support for up/down
  actuator_id?: number; // For multi-actuator systems
}

export interface FeedControlRequest {
  action: "feed" | "stop" | "small" | "medium" | "large" | "custom"; // Legacy support
  amount?: number; // Feed amount in grams
  speed?: number; // Motor speed 0-255
  duration?: number; // Duration in milliseconds
  actuator_up?: number; // Actuator up time in seconds
  actuator_down?: number; // Actuator down time in seconds
  auger_on?: number; // Auger motor on time in seconds
  blower_on?: number; // Blower fan on time in seconds
}

// Ultra Fast Relay Control
export interface UltraFastResponse extends ApiResponse {
  command: string;
  elapsed_ms: number;
  relay_id: number;
}

/**
 * Enhanced Fish Feeder API Client with performance optimizations
 */
export class FishFeederApiClient {
  private baseURL: string;
  private abortController: AbortController | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Enhanced fetch with caching, retries, and proper error handling
   */
  private async enhancedFetch(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true,
    timeout: number = API_CONFIG.TIMEOUT,
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || "GET"}:${url}`;

    // Check cache for GET requests
    if (options.method !== "POST" && useCache && apiCache.has(cacheKey)) {
      return apiCache.get(cacheKey);
    }

    // Cancel previous request if exists
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    const fetchOptions: RequestInit = {
      ...options,
      signal: this.abortController.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await withTimeout(
        withRetry(() => fetch(url, fetchOptions)),
        timeout,
      );

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint,
        );
      }

      const data = await response.json();

      // Cache successful GET responses
      if (options.method !== "POST" && useCache && data.status === "success") {
        apiCache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request was cancelled", 0, endpoint);
        }
        throw new ApiError(error.message, 0, endpoint);
      }
      throw error;
    }
  }

  // Health check with fast timeout
  async checkHealth(): Promise<HealthCheckResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.HEALTH,
      { method: API_CONFIG.METHODS.GET },
      false, // Don't cache health checks
      API_CONFIG.FAST_TIMEOUT,
    );
  }

  // Get all sensors with caching
  async getAllSensors(): Promise<AllSensorsResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.SENSORS,
      { method: API_CONFIG.METHODS.GET },
      true, // Use cache for sensor data
      API_CONFIG.TIMEOUT,
    );
  }

  // Get specific sensor (cached)
  async getSensor(sensorName: string): Promise<SensorReading> {
    return this.enhancedFetch(
      `${API_CONFIG.ENDPOINTS.SENSOR_BY_NAME}/${sensorName}`,
      { method: API_CONFIG.METHODS.GET },
      true,
      API_CONFIG.TIMEOUT,
    );
  }

  // Relay control methods (no cache, fast timeout)
  async getRelayStatus(): Promise<RelayStatusResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.RELAY_STATUS,
      { method: API_CONFIG.METHODS.GET },
      false, // Don't cache relay status
      API_CONFIG.FAST_TIMEOUT,
    );
  }

  async controlLED(
    action: "on" | "off" | "toggle",
  ): Promise<RelayStatusResponse> {
    return this.enhancedFetch(
      `${API_CONFIG.ENDPOINTS.RELAY_LED}/${action}`,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.FAST_TIMEOUT,
    );
  }

  async controlFan(
    action: "on" | "off" | "toggle",
  ): Promise<RelayStatusResponse> {
    return this.enhancedFetch(
      `${API_CONFIG.ENDPOINTS.RELAY_FAN}/${action}`,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.FAST_TIMEOUT,
    );
  }

  // Ultra fast relay control
  async ultraFastRelay(relayId: number): Promise<UltraFastResponse> {
    return this.enhancedFetch(
      `${API_CONFIG.ENDPOINTS.CONTROL_ULTRA}/${relayId}`,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.FAST_TIMEOUT,
    );
  }

  // Control methods
  async controlBlower(request: BlowerControlRequest): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.CONTROL_BLOWER,
      {
        method: API_CONFIG.METHODS.POST,
        body: JSON.stringify(request),
      },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async controlActuator(request: ActuatorControlRequest): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.CONTROL_ACTUATOR,
      {
        method: API_CONFIG.METHODS.POST,
        body: JSON.stringify(request),
      },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async controlFeed(request: FeedControlRequest): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.CONTROL_FEED,
      {
        method: API_CONFIG.METHODS.POST,
        body: JSON.stringify(request),
      },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  // Feed history methods
  async getFeedHistory(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.FEED_HISTORY,
      { method: API_CONFIG.METHODS.GET },
      true, // Cache feed history
      API_CONFIG.TIMEOUT,
    );
  }

  async getFeedStatistics(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.FEED_STATISTICS,
      { method: API_CONFIG.METHODS.GET },
      true, // Cache statistics
      API_CONFIG.TIMEOUT,
    );
  }

  // Firebase sync
  async syncToFirebase(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.SYNC,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  // Cancel all pending requests
  cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Clear cache
  clearCache(): void {
    apiCache.clear();
  }

  // Legacy methods for backward compatibility
  async feedFish(request: FeedControlRequest): Promise<ApiResponse> {
    return this.controlFeed(request);
  }

  async directControl(request: { command: string }): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.CONTROL_DIRECT,
      {
        method: API_CONFIG.METHODS.POST,
        body: JSON.stringify(request),
      },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async calibrateWeight(request: { weight: number }): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.WEIGHT_CALIBRATE,
      {
        method: API_CONFIG.METHODS.POST,
        body: JSON.stringify(request),
      },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async tareWeight(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.WEIGHT_TARE,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async takePhoto(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.PHOTO,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async startRecording(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.RECORD_START,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.TIMEOUT,
    );
  }

  async stopRecording(): Promise<ApiResponse> {
    return this.enhancedFetch(
      API_CONFIG.ENDPOINTS.RECORD_STOP,
      { method: API_CONFIG.METHODS.POST },
      false,
      API_CONFIG.TIMEOUT,
    );
  }
}

// Legacy types for backward compatibility
export interface DirectControlRequest {
  command: string;
}

export interface SensorValue {
  type: string;
  value: number | boolean;
  unit: string;
  timestamp: string;
}

export interface SensorData {
  values: SensorValue[];
  last_updated: number;
}

// Export singleton instance
export const apiClient = new FishFeederApiClient();
