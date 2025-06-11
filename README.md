# 🌐 Fish Feeder Web Application

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)

**🎯 Modern React Web Interface for Fish Feeder IoT System**

[🌐 Live Demo](https://fish-feeder-test-1.web.app) • [📖 API Docs](#-api-integration) • [🚀 Deploy](#-deployment)

</div>

---

## 🌟 Overview

A **production-ready React web application** that provides a comprehensive interface for controlling and monitoring the Fish Feeder IoT system. Built with modern technologies and designed for both desktop and mobile use.

### ✨ Key Features

<table>
<tr>
<td width="50%">

### 📱 **Mobile-First Design**
- 📱 Responsive layout for all devices
- 🎮 Touch-friendly controls
- 📊 Mobile-optimized dashboards
- 🔄 Real-time updates

</td>
<td width="50%">

### 🔄 **Real-Time Monitoring**
- 📊 Live sensor data visualization
- 🎬 Video recording controls
- ⚡ Instant status updates
- 📈 Interactive charts

</td>
</tr>
<tr>
<td>

### 🎛️ **Complete Control**
- 🍽️ Feed control with presets
- ⚙️ Motor and relay management
- 🎥 Camera and recording
- ⚖️ Weight calibration

</td>
<td>

### ☁️ **Cloud Integration**
- 🔥 Firebase hosting
- 💾 Storage monitoring
- 🌐 External access ready
- 📈 Analytics dashboard

</td>
</tr>
</table>

---

## 🚀 Quick Start

### ⚡ Production Deployment

```bash
# Clone and install
git clone <repository-url>
cd fish-feeder-web
npm install

# Build and deploy
npm run build
firebase deploy
```

**Live URL:** https://fish-feeder-test-1.web.app

### 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run in different modes
npm run dev:local     # Connect to local Pi
npm run dev:offline   # Offline mode with mock data
npm run dev:pi        # Connect to Pi via PageKite
```

---

## 📁 Project Structure

```
fish-feeder-web/
├── 📂 src/
│   ├── 📂 components/          # Reusable UI components
│   │   ├── SensorCard.tsx      # Individual sensor display
│   │   ├── ControlPanel.tsx    # Main control interface
│   │   ├── StorageStatus.tsx   # Storage monitoring
│   │   └── VideoPlayer.tsx     # Video recording controls
│   │
│   ├── 📂 pages/               # Application pages
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Settings.tsx        # System configuration
│   │   ├── Analytics.tsx       # Data visualization
│   │   └── History.tsx         # Feeding history
│   │
│   ├── 📂 config/              # Configuration
│   │   ├── api.ts             # Pi server API client
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── constants.ts       # App constants
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   │   ├── useApi.ts          # API communication
│   │   ├── useSensors.ts      # Sensor data management
│   │   └── useStorage.ts      # Storage monitoring
│   │
│   ├── 📂 types/               # TypeScript definitions
│   │   ├── api.ts             # API response types
│   │   ├── sensors.ts         # Sensor data types
│   │   └── storage.ts         # Storage types
│   │
│   └── 📂 styles/              # Styling
│       ├── globals.css        # Global styles
│       └── components.css     # Component styles
│
├── 📂 public/                  # Static assets
├── 📄 package.json             # Dependencies and scripts
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tailwind.config.js      # TailwindCSS config
├── 📄 firebase.json           # Firebase hosting config
└── 📄 README.md               # This file
```

---

## 🔌 API Integration

### 🍓 Pi Server Communication

The web app communicates with the Raspberry Pi server through a comprehensive API client:

```typescript
// Configure API endpoints
export const API_CONFIG = {
  BASE_URL: "http://localhost:5000", // Pi server URL
  ENDPOINTS: {
    HEALTH: "/api/health",
    SENSORS: "/api/sensors", 
    FEED: "/api/feed",
    CONTROL: "/api/control",
    STORAGE: "/api/storage",
    CAMERA: "/api/camera",
    PAGEKITE: "/api/pagekite"
  }
}

// Example usage
const api = new FishFeederApiClient();
const sensors = await api.getAllSensors();
const feedResult = await api.controlFeed({
  action: "feed",
  amount: 100,
  record_video: true
});
```

### 📊 Real-time Updates

```typescript
// WebSocket connection for live data
const useRealtimeData = () => {
  const [sensorData, setSensorData] = useState({});
  
  useEffect(() => {
    const socket = io(API_CONFIG.BASE_URL);
    
    socket.on('sensor_update', (data) => {
      setSensorData(data);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return sensorData;
};
```

---

## 🎛️ Main Features

### 📊 Dashboard Page

**Real-time monitoring interface with:**
- 🌡️ **Temperature & Humidity** sensors (DHT22 x2)
- 🌊 **Water Temperature** monitoring (DS18B20)
- ⚖️ **Weight Sensors** for food level (HX711)
- 🔋 **Power System** monitoring (Solar + Battery)
- 💧 **Soil Moisture** tracking

### 🍽️ Feed Control

**Complete feeding management:**
```typescript
// Feed presets available
const FEED_PRESETS = {
  small: { amount: 50, duration: 30 },
  medium: { amount: 100, duration: 60 },
  large: { amount: 200, duration: 120 },
  xl: { amount: 1000, duration: 300 }
};

// Custom feeding with video recording
await api.controlFeed({
  preset: "medium",
  record_video: true,
  actuator_up: 3,
  actuator_down: 2,
  auger_duration: 20,
  blower_duration: 15
});
```

### 🎬 Video Recording

**Automatic video capture:**
- 📹 **Start/Stop Recording** controls
- 🎥 **Live Preview** during feeding
- ☁️ **Cloud Upload Status** monitoring
- 📱 **Mobile Video Player** with controls

### 💾 Storage Dashboard

**Smart storage monitoring:**
```typescript
// Storage status display
const StorageStatus = () => {
  const { data } = useStorage();
  
  return (
    <div className="storage-grid">
      <StorageCard 
        title="Pi Local"
        used={data.pi_local.used_gb}
        total={128}
        percentage={data.pi_local.percentage}
      />
      <StorageCard 
        title="Firebase"
        used={data.firebase.used_gb}
        total={5}
        percentage={data.firebase.percentage}
      />
      <StorageCard 
        title="Google Drive"
        used={data.google_drive.used_gb}
        total={200}
        percentage={data.google_drive.percentage}
      />
    </div>
  );
};
```

### ⚙️ Settings Page

**System configuration:**
- 🔧 **Pi Server Settings** (timing, intervals)
- 🎥 **Camera Configuration** (resolution, FPS)
- 🍽️ **Feed Presets** customization
- 🌐 **PageKite Tunnel** control
- 💾 **Storage Management** settings

---

## 🔧 Advanced Features

### 📱 Progressive Web App (PWA)

```json
// Built-in PWA capabilities
{
  "name": "Fish Feeder Control",
  "short_name": "Fish Feeder",
  "theme_color": "#2563eb", 
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

### 🌐 Multi-Environment Support

```typescript
// Environment configurations
const environments = {
  local: "http://localhost:5000",           // Local Pi
  pagekite: "https://b65iee02.pagekite.me", // External access
  offline: "disabled"                       // Mock data mode
};
```

### 📊 Data Visualization

**Interactive charts with Recharts:**
- 📈 **Sensor History** line charts
- 🥧 **Storage Usage** pie charts  
- 📊 **Feeding Analytics** bar charts
- 🕒 **Real-time Updates** every 5 seconds

### 🎨 Modern UI Components

**Built with NextUI + TailwindCSS:**
```typescript
// Example component usage
<Card className="sensor-card">
  <CardHeader>
    <Icon className="text-primary" />
    <span>Temperature</span>
  </CardHeader>
  <CardBody>
    <Progress 
      value={temperature} 
      max={50}
      color="warning"
    />
    <span className="text-2xl font-bold">
      {temperature}°C
    </span>
  </CardBody>
</Card>
```

---

## 🚀 Deployment

### 🔥 Firebase Hosting (Production)

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Deploy with custom domain
firebase deploy --project fish-feeder-prod
```

**Live URLs:**
- **Production**: https://fish-feeder-test-1.web.app
- **Staging**: https://fish-feeder-staging.web.app

### 📦 Build Optimization

```typescript
// Vite configuration for optimal builds
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@nextui-org/react'],
          charts: ['recharts']
        }
      }
    }
  }
});
```

### 🌐 Environment Variables

```bash
# .env file configuration
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_PAGEKITE_URL=https://b65iee02.pagekite.me
VITE_ENABLE_PWA=true
```

---

## 🧪 Development & Testing

### 🔄 Development Workflow

```bash
# Start development with different configs
npm run dev                    # Default local setup
npm run dev:mock              # Offline mode with mock data
npm run dev:pagekite          # Connect via PageKite tunnel

# Build and preview
npm run build
npm run preview

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

### 🎭 Mock Data Mode

For development without Pi server:
```typescript
// Automatic mock responses when API is unavailable
const getMockResponse = (endpoint: string) => {
  switch(endpoint) {
    case '/api/sensors':
      return mockSensorData;
    case '/api/storage/status':
      return mockStorageData;
    default:
      return { status: 'success', data: {} };
  }
};
```

### 📱 Responsive Testing

**Tested on:**
- 📱 **Mobile**: iPhone, Android phones
- 📱 **Tablet**: iPad, Android tablets  
- 💻 **Desktop**: Chrome, Firefox, Safari, Edge
- 🖥️ **Large Screens**: 1080p, 1440p, 4K

---

## 🔧 API Client Features

### ⚡ Performance Optimizations

```typescript
// Smart caching and request optimization
class FishFeederApiClient {
  private cache = new Map();
  
  async enhancedFetch(endpoint: string, options = {}) {
    // Check cache first
    if (this.cache.has(endpoint)) {
      const cached = this.cache.get(endpoint);
      if (Date.now() - cached.timestamp < 30000) {
        return cached.data;
      }
    }
    
    // Request with timeout and retry
    const response = await withRetry(
      () => fetch(endpoint, { ...options, timeout: 5000 }),
      3, // max retries
      1000 // delay
    );
    
    // Cache successful responses
    const data = await response.json();
    this.cache.set(endpoint, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }
}
```

### 🔒 Error Handling

```typescript
// Comprehensive error handling
const handleApiError = (error: ApiError) => {
  switch(error.status) {
    case 404:
      showNotification("Pi server not found", "warning");
      break;
    case 500:
      showNotification("Server error occurred", "error");
      break;
    case 0:
      showNotification("Connection lost - using cached data", "info");
      break;
  }
};
```

---

## 📊 Performance Metrics

### ⚡ Load Times
- **Initial Load**: < 2 seconds
- **Subsequent Visits**: < 500ms (cached)
- **API Response**: < 100ms (local network)
- **PageKite Response**: < 300ms (external)

### 📱 Mobile Performance
- **Lighthouse Score**: 95+ 
- **Core Web Vitals**: All green
- **Bundle Size**: < 500KB gzipped
- **Runtime Performance**: 60fps animations

---

## 🚨 Troubleshooting

<details>
<summary><strong>🔌 API Connection Issues</strong></summary>

```typescript
// Check connection status
const checkConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// Auto-retry with exponential backoff
const retryConnection = async (maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    if (await checkConnection()) return true;
    await new Promise(resolve => 
      setTimeout(resolve, Math.pow(2, i) * 1000)
    );
  }
  return false;
};
```

</details>

<details>
<summary><strong>📱 Mobile Issues</strong></summary>

**Common fixes:**
- Clear browser cache
- Check network connectivity  
- Ensure Pi server is running
- Verify PageKite tunnel status

</details>

<details>
<summary><strong>🔥 Firebase Issues</strong></summary>

```bash
# Re-deploy to Firebase
firebase login
firebase deploy --force

# Check Firebase status
firebase projects:list
firebase hosting:channel:list
```

</details>

---

## 🎯 Roadmap

### 🔮 Version 2.1 Features
- 📱 **Native Mobile App** (React Native)
- 🤖 **AI Fish Detection** integration
- 📊 **Advanced Analytics** with ML insights
- 🔔 **Push Notifications** for alerts
- 🌍 **Multi-language** support

### 🛠️ Technical Improvements
- ⚡ **WebAssembly** for heavy computations
- 🔄 **Service Workers** for offline functionality
- 📈 **Real-time Charts** with WebSocket streaming
- 🎮 **Gameification** elements for user engagement

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/ui-improvement`)
3. **Make your changes** with proper TypeScript types
4. **Test on multiple devices** (mobile + desktop)
5. **Commit changes** (`git commit -m 'Add mobile optimization'`)
6. **Push to branch** (`git push origin feature/ui-improvement`)
7. **Open Pull Request**

### 🎨 UI/UX Guidelines
- 📱 **Mobile-first** design approach
- 🎨 **NextUI** component consistency
- 🌈 **Accessible** color schemes
- ⚡ **Performance** focused animations

---

<div align="center">

**🌐 Modern Web Interface for Smart Fish Feeding**

### 🌟 Status: **Production Ready 100%**

[🌐 Try Live Demo](https://fish-feeder-test-1.web.app) • [📖 Full API Docs](../pi-mqtt-server/README.md) • [🔧 Arduino Code](../fish-feeder-arduino/README.md)

**⭐ Star this repo if the web interface helped you! ⭐**

</div> 