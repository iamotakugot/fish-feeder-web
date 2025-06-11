# 🐟 Fish Feeder Web Application

**แอปพลิเคชันเว็บสำหรับควบคุมและมอนิเตอร์เครื่องป้อนปลาอัตโนมัติ แบบเรียลไทม์**

[![GitHub Repository](https://img.shields.io/badge/GitHub-fish--feeder--web-blue?logo=github)](https://github.com/iamotakugot/fish-feeder-web)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase%20Hosting-orange?logo=firebase)](https://fish-feeder-test-1.web.app)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript)](https://www.typescriptlang.org/)

## 🌐 Live Demo

**🚀 เว็บไซต์**: [https://fish-feeder-test-1.web.app](https://fish-feeder-test-1.web.app)  
**📂 GitHub**: [https://github.com/iamotakugot/fish-feeder-web](https://github.com/iamotakugot/fish-feeder-web)

## 📋 ข้อมูลเบื้องต้น

- **Framework**: React 18.3.1 + TypeScript 5.6.3
- **UI Library**: HeroUI 2.x (Modern Design System)
- **Build Tool**: Vite 5.2.0 ⚡
- **Styling**: Tailwind CSS 3.4.16
- **Backend**: Firebase Realtime Database + Pi Server API
- **Deployment**: Firebase Hosting
- **Icons**: React Icons 5.5.0
- **Charts**: Recharts 2.15.3
- **Animation**: Framer Motion 11.15.0

## 🎯 โครงสร้างโปรเจค

```
fish-feeder-web/
├── 📁 src/
│   ├── 📁 components/          # UI Components
│   │   ├── Layout.tsx          # หน้าเว็บหลัก
│   │   ├── Sidebar.tsx         # แถบเมนู
│   │   ├── RelayControl.tsx    # ควบคุม Relay
│   │   ├── UltraFastRelayControl.tsx  # ควบคุมเร็ว
│   │   └── FirebaseRelayControl.tsx   # ควบคุมผ่าน Firebase
│   ├── 📁 pages/               # หน้าเว็บต่างๆ
│   │   ├── Dashboard.tsx       # แดชบอร์ดหลัก (Pi Data)
│   │   ├── FirebaseDashboard.tsx # แดชบอร์ด Firebase
│   │   ├── FeedControl.tsx     # ควบคุมการป้อนอาหาร
│   │   ├── FanTempControl.tsx  # ควบคุมพัดลมและอุณหภูมิ
│   │   ├── MotorPWM.tsx        # ควบคุมมอเตอร์ PWM
│   │   ├── Analytics.tsx       # วิเคราะห์ข้อมูล
│   │   └── Settings.tsx        # ตั้งค่าระบบ
│   ├── 📁 config/              # การตั้งค่า
│   │   ├── api.ts              # API Configuration
│   │   ├── firebase.ts         # Firebase Config
│   │   └── firebase_realtime.ts # Firebase Realtime
│   ├── 📁 hooks/               # Custom React Hooks
│   │   ├── useFishFeederApi.ts # API Hook
│   │   ├── useFirebaseSensorData.ts # Firebase Data
│   │   ├── useSmartSensorData.ts # Smart Sensor Logic
│   │   └── usePreventDoubleSubmit.ts # Prevent Double Click
│   ├── 📁 utils/               # Utility Functions
│   │   ├── sensorUtils.ts      # Sensor Helpers
│   │   ├── firebaseSensorUtils.ts # Firebase Helpers
│   │   └── testApi.ts          # API Testing
│   └── 📁 types/               # TypeScript Types
│       └── index.ts            # Type Definitions
├── 📁 public/                  # Static Files
├── 📄 package.json             # Dependencies
├── 📄 vite.config.ts           # Build Configuration
├── 📄 tailwind.config.js       # Tailwind CSS Config
├── 📄 firebase.json            # Firebase Hosting Config
├── 📄 vercel.json              # Vercel Deploy Config
└── 📄 README.md                # Documentation
```

## 🚀 การติดตั้งและรัน

### **1. Clone Repository**
```bash
git clone https://github.com/iamotakugot/fish-feeder-web.git
cd fish-feeder-web
```

### **2. ติดตั้ง Dependencies**
```bash
# ติดตั้ง Node.js packages
npm install

# หรือใช้ yarn/pnpm
yarn install
# หรือ
pnpm install
```

### **3. ตั้งค่า Environment Variables**
```bash
# สร้างไฟล์ .env ในโฟลเดอร์ root
touch .env

# เพิ่มการตั้งค่า API และ Firebase
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=fish-feeder-test-1.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://fish-feeder-test-1-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=fish-feeder-test-1
VITE_FIREBASE_STORAGE_BUCKET=fish-feeder-test-1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=965648166404
VITE_FIREBASE_APP_ID=1:965648166404:web:9a8e0c5c8be5b2e4b5f9e8
```

### **4. รันในโหมดพัฒนา**
```bash
# Development server
npm run dev

# เปิดเบราว์เซอร์ไปที่: http://localhost:5173
```

### **5. Build สำหรับ Production**
```bash
# Build สำหรับ production
npm run build

# Preview build locally
npm run preview

# Deploy to Firebase Hosting
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

## 🎯 ฟีเจอร์หลัก

### **📈 Real-time Dashboard**
- 🌡️ **เซนเซอร์อุณหภูมิ**: ถังอาหาร, ตู้ควบคุม, อุณหภูมิน้ำ (DHT22, DS18B20)
- 💧 **เซนเซอร์ความชื้น**: ความชื้นอากาศและดิน
- ⚖️ **เซนเซอร์น้ำหนัก**: มอนิเตอร์น้ำหนักอาหารแบบเรียลไทม์ (HX711)
- 🔋 **ระบบพลังงาน**: แบตเตอรี่, โซลาร์เซลล์, กระแสโหลด
- 📊 **กราฟเรียลไทม์**: แสดงข้อมูลประวัติด้วย Recharts
- 🔄 **Auto Refresh**: อัพเดทข้อมูลทุก 5 วินาที

### **🎮 Remote Control System**
- 🔌 **Relay Control**: ควบคุม LED และพัดลมระบายอากาศ
- 🌾 **Auger Motor**: ควบคุมมอเตอร์ส่งอาหาร (PWM Speed Control)
- 💨 **Blower Fan**: ควบคุมพัดลมเป่าอาหาร (Variable Speed)
- 🔧 **Linear Actuator**: ควบคุมประตูถังอาหาร (Up/Down)
- ⚡ **Ultra Fast Control**: ระบบควบคุมความเร็วสูง (< 100ms)
- 🛡️ **Double Click Protection**: ป้องกันการกดซ้ำ

### **🍚 Smart Feeding System**
- 🎯 **Manual Feed**: ป้อนอาหารแบบกำหนดเอง (กรัม/วินาที)
- ⏰ **Auto Schedule**: ตั้งเวลาป้อนอาหารอัตโนมัติ
- 📏 **Preset Amounts**: เล็ก (50g), กลาง (100g), ใหญ่ (200g)
- ⚖️ **Weight Monitoring**: ตรวจสอบน้ำหนักก่อน-หลังป้อน
- 🔄 **Feed History**: บันทึกประวัติการป้อนอาหาร
- 📊 **Analytics**: วิเคราะห์รูปแบบการป้อนอาหาร

### **⚙️ Advanced Configuration**
- 🌡️ **Temperature Control**: ตั้งค่าอุณหภูมิเปิดพัดลมอัตโนมัติ
- ⚡ **Motor Speed**: ควบคุมความเร็วมอเตอร์ (0-255 PWM)
- ⚖️ **Weight Calibration**: ปรับแต่งความแม่นยำน้ำหนัก
- 🔧 **Device Configuration**: ตั้งค่าอุปกรณ์ต่างๆ
- 📡 **API Settings**: กำหนด Pi Server API Endpoint
- 🎨 **UI Customization**: ปรับแต่งธีมและการแสดงผล

## 💻 เทคโนโลยีที่ใช้

### **🎨 Frontend Technologies:**
```json
{
  "react": "18.3.1",           // Modern React with Hooks & Suspense
  "typescript": "5.6.3",       // Type-safe JavaScript
  "vite": "5.2.0",            // ⚡ Fast build tool
  "@heroui/system": "2.4.15",  // Beautiful UI Components
  "tailwindcss": "3.4.16",    // Utility-first CSS
  "react-router-dom": "7.6.0", // Client-side routing
  "framer-motion": "11.15.0",  // Smooth animations
  "react-icons": "5.5.0",     // 🎨 Icon library
  "recharts": "2.15.3",       // 📊 Beautiful charts
  "firebase": "11.9.1"        // Real-time database
}
```

### **🔧 Development Tools:**
```json
{
  "eslint": "9.25.1",         // Code linting
  "prettier": "3.5.3",        // Code formatting
  "@typescript-eslint": "8.31.1", // TypeScript linting
  "autoprefixer": "10.4.21",  // CSS prefixes
  "vite-tsconfig-paths": "4.3.2"  // Path mapping
}
```

## 🔥 API Integration

### **🤖 Pi Server API:**
```typescript
// API Configuration
const API_CONFIG = {
  BASE_URL: "http://pi-server:5000",
  ENDPOINTS: {
    SENSORS: "/api/sensors",
    CONTROL_DIRECT: "/api/control/direct",
    RELAY_STATUS: "/api/relay/status",
    CONTROL_ULTRA: "/api/control/ultra"
  }
}

// Real-time sensor data
const { data, loading, error } = useSmartSensorData();

// Device control
await apiClient.controlLED('toggle');
await apiClient.controlFan('on');
await apiClient.feedFish({ amount: 100, speed: 200 });
```

### **🔥 Firebase Realtime Database:**
```typescript
// Real-time data sync
const sensorRef = ref(database, 'fish_feeder/sensors');
onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  updateUI(data);
});

// Send control commands
const controlRef = ref(database, 'fish_feeder/control');
await set(controlRef, { led: 'on', fan: 'toggle' });
```

## 🏗️ การ Deploy

### **🔥 Firebase Hosting (Current)**
```bash
# Build และ deploy
npm run build
npx firebase deploy --only hosting

# URL: https://fish-feeder-test-1.web.app
```

### **▲ Vercel (Alternative)**
```bash
# Deploy to Vercel
npx vercel --prod

# Auto-deploy จาก GitHub push
```

### **📦 Docker (Optional)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📱 Responsive Design

### **💻 Desktop (1200px+):**
- 🖥️ Dashboard 3-4 คอลัมน์แสดงข้อมูลครบถ้วน
- 📊 กราฟขนาดใหญ่พร้อมรายละเอียด
- 🎛️ Control panels แยกหมวดหมู่ชัดเจน
- 📋 Sidebar navigation ด้านซ้าย

### **📱 Tablet (768px - 1199px):**
- 📱 Dashboard 2 คอลัมน์เหมาะสมกับหน้าจอ
- 📈 กราฟขนาดกลางใช้งานสะดวก
- 🔘 ปุ่มควบคุมขนาดใหญ่สำหรับสัมผัส
- 🍔 Hamburger menu navigation

### **📱 Mobile (< 768px):**
- 📲 Dashboard 1 คอลัมน์เหมาะกับมือถือ
- 📊 กราฟแสดงข้อมูลสำคัญ
- 👆 ปุ่มควบคุมขนาดใหญ่ easy touch
- 📍 Bottom navigation bar

## 🎨 UI Components

### **📊 Dashboard Cards:**
```tsx
<Card className="p-4 shadow-lg">
  <CardHeader>
    <h3>🌡️ อุณหภูมิถังอาหาร</h3>
  </CardHeader>
  <CardBody>
    <span className="text-3xl font-bold">26.5°C</span>
    <div className="text-sm text-gray-500">
      ความชื้น: 65.2%
    </div>
  </CardBody>
</Card>
```

### **🎮 Control Buttons:**
```tsx
<Button 
  color="primary" 
  size="lg"
  onPress={() => sendCommand('R:1')}
>
  🔴 เปิด LED
</Button>
```

### **📈 Charts:**
```tsx
<LineChart width={400} height={300} data={sensorData}>
  <XAxis dataKey="time" />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
</LineChart>
```

## 🚀 Deploy การใช้งาน

### **1. Firebase Hosting:**
```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login เข้า Firebase
firebase login

# Initialize project
firebase init hosting

# Build และ deploy
npm run build
firebase deploy
```

### **2. Vercel Deployment:**
```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### **3. Custom Domain:**
```bash
# เพิ่ม custom domain ใน Vercel dashboard
# หรือผ่าน Firebase Console
```

## 🔧 การกำหนดค่า

### **⚙️ Environment Variables:**
```bash
# .env (สำหรับ development)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id

# .env.production (สำหรับ production)
VITE_API_URL=https://your-production-api.com
```

### **🎨 Tailwind Customization:**
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#006FEE",
        secondary: "#9353D3"
      }
    }
  }
}
```

### **🔗 Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🛠️ แก้ปัญหา

### **❌ Firebase Connection Error:**
```bash
# ตรวจสอบ Firebase config
console.log(process.env.VITE_FIREBASE_PROJECT_ID)

# ตรวจสอบ Firebase rules
# Database Rules ต้องอนุญาต read/write

# ตรวจสอบ internet connection
ping firebase.google.com
```

### **📱 Build Error:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# ตรวจสอบ TypeScript errors
npm run lint

# ตรวจสอบ dependencies
npm audit fix
```

### **🎨 Styling Issues:**
```bash
# รีบิลด์ Tailwind
npx tailwindcss build

# ตรวจสอบ PostCSS config
npm run build:css

# Clear browser cache
Ctrl+Shift+R (หรือ Cmd+Shift+R)
```

### **📊 Chart ไม่แสดง:**
```bash
# ตรวจสอบ Recharts version
npm list recharts

# ติดตั้งใหม่
npm uninstall recharts
npm install recharts@^2.15.3
```

## 📈 Performance

### **⚡ Loading Speed:**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Time to Interactive**: < 3.0s
- **Bundle Size**: ~800KB (gzipped)

### **📊 Real-time Updates:**
- **Firebase Sync**: < 100ms
- **UI Re-render**: < 16ms (60fps)
- **Chart Updates**: Smooth animations
- **Mobile Performance**: Optimized for 3G

## 📚 ไฟล์เพิ่มเติม

### **📁 โครงสร้างโปรเจกต์:**
```
fish-feeder-web/
├── 📁 src/                    # ซอร์สโค้ดหลัก
│   ├── 📁 components/         # React components
│   ├── 📁 pages/             # หน้าเว็บต่างๆ
│   ├── 📁 hooks/             # Custom hooks
│   ├── 📁 utils/             # Utility functions
│   ├── 📁 types/             # TypeScript types
│   └── 📄 main.tsx           # Entry point
├── 📁 public/                # Static assets
├── 📄 package.json           # Dependencies
├── 📄 vite.config.ts         # Vite config
├── 📄 tailwind.config.js     # Tailwind config
├── 📄 firebase.json          # Firebase config
└── 📄 README.md              # เอกสารนี้
```

### **📦 Key Dependencies:**
```json
{
  "react": "18.3.1",
  "typescript": "5.6.3", 
  "firebase": "11.9.1",
  "@heroui/system": "2.4.15",
  "tailwindcss": "3.4.16",
  "recharts": "2.15.3",
  "framer-motion": "11.15.0",
  "react-router-dom": "7.6.0"
}
```

## 🎯 การใช้งานกับระบบอื่น

### **🍓 Raspberry Pi Connection:**
```
Web App รับข้อมูลจาก Raspberry Pi ผ่าน Firebase
- Real-time sensor data display
- Remote control commands
- System status monitoring
- Performance analytics
```

### **🤖 Arduino Integration:**
```
ส่งคำสั่งควบคุมไป Arduino ผ่าน Raspberry Pi
- Relay control (LED, พัดลม)
- Motor control (Auger, Blower, Actuator)  
- Auto feeding system
- Sensor calibration
```

---

**🌐 Web Application Ready!**  
แดชบอร์ดสวยงามสำหรับควบคุม Fish Feeder IoT System
