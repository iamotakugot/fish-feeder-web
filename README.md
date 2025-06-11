# 🌐 Fish Feeder Web Application

**แอปพลิเคชันเว็บสำหรับควบคุมและมอนิเตอร์เครื่องป้อนปลาอัตโนมัติ**

## 📋 ข้อมูลเบื้องต้น

- **Framework**: React 18.3.1 + TypeScript
- **UI Library**: HeroUI (Modern Design System)
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.16
- **Backend**: Firebase Realtime Database
- **Deployment**: Vercel + Firebase Hosting

## 🎯 ไฟล์หลัก

| โฟลเดอร์/ไฟล์ | ขนาด | หน้าที่ | เทคโนโลยี |
|---------------|------|---------|------------|
| **📁 src/** | - | **ซอร์สโค้ดหลัก** | React + TypeScript |
| **📄 package.json** | 71 lines | Dependencies | npm packages |
| **📄 index.html** | 36 lines | HTML template | Vite entry |
| **📄 vite.config.ts** | 9 lines | Build config | Vite settings |
| **📄 tailwind.config.js** | 18 lines | CSS config | Tailwind setup |
| **📄 firebase.json** | 17 lines | Firebase config | Hosting rules |

## 🚀 การติดตั้งและรัน

### **1. ติดตั้ง Dependencies**
```bash
# ติดตั้ง Node.js packages
npm install

# หรือใช้ yarn
yarn install
```

### **2. ตั้งค่า Firebase**
```bash
# 1. สร้างไฟล์ .env ในโฟลเดอร์ root
touch .env

# 2. เพิ่มการตั้งค่า Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### **3. รันในโหมดพัฒนา**
```bash
# Development server
npm run dev

# เปิดเบราว์เซอร์ไปที่: http://localhost:5173
```

### **4. Build สำหรับ Production**
```bash
# Build สำหรับ production
npm run build

# Preview build
npm run preview
```

## 📊 ฟีเจอร์หลัก

### **📈 Real-time Dashboard**
- 🌡️ แสดงอุณหภูมิและความชื้น (ถังอาหาร, ตู้ควบคุม, น้ำ)
- ⚖️ มอนิเตอร์น้ำหนักอาหารแบบเรียลไทม์
- 🔋 สถานะแบตเตอรี่และพลังงานโซลาร์
- 🌱 ความชื้นดินและสภาพแวดล้อม
- 📊 กราฟแสดงข้อมูลประวัติ

### **🎮 Remote Control**
- 🔌 ควบคุม Relay (LED, พัดลม) 
- 🌾 ควบคุม Auger Motor (ส่งอาหาร)
- 💨 ควบคุม Blower Fan (ระบายอากาศ)
- 🔧 ควบคุม Linear Actuator (เปิด/ปิดประตู)
- 🍚 ระบบป้อนอาหารอัตโนมัติ (เล็ก/กลาง/ใหญ่)

### **⚙️ Configuration**
- ⚡ ตั้งค่าความเร็วมอเตอร์
- 🌡️ ตั้งค่าอุณหภูมิเปิดพัดลม
- ⏰ ตั้งเวลาป้อนอาหาร
- ⚖️ ปรับแต่งการ Calibration น้ำหนัก
- 🔧 การตั้งค่าระบบขั้นสูง

## 💻 เทคโนโลยีที่ใช้

### **🎨 Frontend Stack:**
```
React 18.3.1          # Modern React with Hooks
TypeScript 5.6.3      # Type-safe JavaScript
HeroUI 2.x            # Beautiful UI Components
Tailwind CSS 3.4.16   # Utility-first CSS
Vite 5.2.0            # Fast build tool
React Router 7.6.0    # Client-side routing
```

### **📊 Data & Charts:**
```
Recharts 2.15.3       # Beautiful charts
React Icons 5.5.0     # Icon library
Framer Motion 11.15.0 # Smooth animations
Firebase 11.9.1       # Real-time database
```

### **🛠️ Development Tools:**
```
ESLint 9.25.1         # Code linting
Prettier 3.5.3        # Code formatting  
TypeScript ESLint      # TypeScript linting
Autoprefixer 10.4.21   # CSS prefixes
```

## 🔥 Firebase Integration

### **📡 Real-time Data Sync:**
```javascript
// อ่านข้อมูลเซนเซอร์แบบ Real-time
const sensorRef = ref(database, 'sensors');
onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  // อัพเดท UI ทันที
});
```

### **🎮 Remote Control:**
```javascript
// ส่งคำสั่งควบคุม
const controlRef = ref(database, 'controls/relay');
set(controlRef, 'R:1'); // เปิด Relay 1
```

### **📊 Data Structure:**
```json
{
  "sensors": {
    "feed_temp": 26.5,
    "feed_humidity": 65.2,
    "control_temp": 28.1,
    "control_humidity": 60.8,
    "water_temp": 24.5,
    "weight": 2.34,
    "soil_moisture": 45.0,
    "battery_voltage": 12.6,
    "solar_current": 0.85,
    "solar_voltage": 18.2,
    "load_current": 0.42,
    "battery_percentage": 78.5,
    "is_charging": true,
    "timestamp": 1703123456
  },
  "controls": {
    "relay": "R:0",
    "auger": "G:0", 
    "blower": "B:0",
    "actuator": "A:0",
    "feeding": "FEED:stop"
  }
}
```

## 📱 Responsive Design

### **💻 Desktop (1200px+):**
- Dashboard แสดง 4 คอลัมน์
- กราฟขนาดใหญ่แสดงรายละเอียด
- Panel ควบคุมแยกเป็นหมวดหมู่
- Sidebar นำทางด้านซ้าย

### **📱 Tablet (768px - 1199px):**
- Dashboard แสดง 2 คอลัมน์
- กราฟขนาดกลางพอดี
- ปุ่มควบคุมขนาดใหญ่กว่า
- Navigation แบบ hamburger menu

### **📱 Mobile (< 768px):**
- Dashboard แสดง 1 คอลัมน์
- กราฟแสดงข้อมูลสำคัญ
- ปุ่มควบคุมขนาดใหญ่สำหรับสัมผัส
- Bottom navigation

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
├── 📄 tsconfig.json          # TypeScript config
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
