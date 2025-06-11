# 🐟 Fish Feeder Web Application (v2.2.0)

**รหัสโปรเจค:** B65IEE02  
**สาขาวิชา:** วิศวกรรมไฟฟ้าอุตสาหการ  
**มหาวิทยาลัย:** มหาวิทยาลัยเทคโนโลยีสุรนารี

## 🎯 Project Overview

ระบบป้อนอาหารปลาอัตโนมัติแบบครบวงจร พร้อมระบบตรวจสอบและควบคุมผ่าน Web Application แบบ Real-time รวมถึงระบบปรับเทียบเครื่องชั่งน้ำหนัก HX711 แบบครบวงจร

### ✨ Features หลัก

- **⚖️ HX711 Weight Calibration**: ระบบปรับเทียบเครื่องชั่งน้ำหนักแบบ Step-by-step พร้อม Real-time monitoring
- **🔄 Real-time Dashboard**: อัพเดตข้อมูลอัตโนมัติทุก 5 วินาทีโดยไม่ต้องรีเฟรชหน้า
- **📱 Responsive UI**: รองรับการใช้งานบนมือถือและแท็บเล็ต
- **🌡️ Smart Cooling Fan**: ควบคุมพัดลมระบายความร้อนแบบอัตโนมัติตามอุณหภูมิ
- **📊 Data Visualization**: แสดงผลข้อมูลแบบกราฟ Real-time
- **🔋 Power Management**: ตรวจสอบสถานะพลังงานและแบตเตอรี่
- **🎛️ Motor PWM Control**: ควบคุมมอเตอร์แบบละเอียดด้วย PWM
- **🔥 Firebase Integration**: บันทึกข้อมูลแบบ Cloud หรือใช้ Local API เป็น fallback
- **📡 System Status Monitoring**: ติดตามสถานะ Arduino, Firebase, Camera, WebSocket แบบ Real-time

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + HeroUI Components
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting
- **Database**: Firebase Realtime Database
- **Icons**: React Icons (Lucide, Font Awesome, Material Design)
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📂 Project Structure

```
fish-feeder-web/
├── src/
│   ├── components/        # React Components
│   │   ├── DashboardSensorPanel.tsx  # Main dashboard
│   │   ├── Layout.tsx               # App layout
│   │   └── ...
│   ├── pages/             # Page Components
│   │   ├── Settings.tsx             # HX711 Calibration & System Settings
│   │   ├── FeedControl.tsx          # Feed control interface
│   │   ├── FirebaseDashboard.tsx    # Firebase-based dashboard
│   │   └── ...
│   ├── hooks/             # Custom Hooks
│   │   ├── useFirebaseSensorData.ts # Firebase data hook
│   │   └── ...
│   ├── utils/             # Utility Functions
│   ├── config/            # Configuration
│   │   ├── api.ts                   # API configuration & client
│   │   └── firebase.ts              # Firebase configuration
│   └── types/             # TypeScript types
├── public/                # Static Assets
├── PI_SERVER_AI_INSTRUCTION.md      # AI Instructions for Pi Server
├── firebase.json                    # Firebase hosting config
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm หรือ yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd fish-feeder-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase
npx firebase deploy --only hosting
```

## 🔧 Configuration

### Firebase Setup
1. สร้าง Firebase project ใหม่
2. เปิดใช้งาน Realtime Database
3. Copy config ไปใส่ใน `src/config/firebase.ts`

### Pi Server Integration
อ่านไฟล์ `PI_SERVER_AI_INSTRUCTION.md` สำหรับรายละเอียดการตั้งค่า Pi Server

## ⚖️ HX711 Weight Calibration System

### การใช้งานระบบปรับเทียบเครื่องชั่ง

1. **เข้าสู่หน้า Settings**: ไปที่ `/settings`
2. **เตรียมน้ำหนักมาตรฐาน**: ใส่ค่าน้ำหนักที่ทราบแน่นอน (100-5000 กรัม)
3. **เริ่มปรับเทียบ**: กดปุ่ม "เริ่มปรับค่าเครื่องชั่ง"

### ขั้นตอนการปรับเทียบ (3 Steps)

**ขั้นตอนที่ 1: Tare (ปรับศูนย์)**
- เอาวัตถุทุกอย่างออกจากเครื่องชั่ง
- กดปุ่ม "เริ่มปรับเทียร์ (Tare)"
- รอให้ระบบปรับศูนย์เสร็จสิ้น

**ขั้นตอนที่ 2: Calibration (ปรับค่า)**
- วางน้ำหนักมาตรฐานลงบนเครื่องชั่ง
- กดปุ่ม "ปรับค่า (XXX g)"
- รอให้ระบบคำนวณค่า calibration

**ขั้นตอนที่ 3: Complete (เสร็จสิ้น)**
- ระบบแสดง "เครื่องชั่งพร้อมใช้งาน"
- ขั้นตอนการปรับเทียบเสร็จสมบูรณ์

### ฟีเจอร์เพิ่มเติม
- **Reset Calibration**: รีเซ็ตการปรับค่าเครื่องชั่ง
- **Real-time Weight Display**: แสดงน้ำหนักปัจจุบัน (0.001 kg precision)
- **Status Indicators**: แสดงสถานะเครื่องชั่ง (ปรับค่าแล้ว/ยังไม่ปรับค่า)

## 📋 API Endpoints (Pi Server)

### Core Endpoints
```
GET    /api/health                   - Health check
GET    /api/sensors                 - Get all sensor data
POST   /api/control/feed            - Feed control
POST   /api/control/direct          - Direct command
```

### HX711 Calibration Endpoints (NEW)
```
POST   /api/control/weight/tare     - Tare (zero) the weight sensor
POST   /api/control/weight/calibrate - Calibrate with known weight
POST   /api/control/weight/reset    - Reset calibration
```

### System Control
```
GET    /api/control/config          - Get system configuration
POST   /api/control/fan-auto        - Fan auto control
GET    /api/sensors/history         - Get historical data
```

## 🎮 การใช้งาน

### Dashboard หลัก
- ตรวจสอบสถานะเซ็นเซอร์แบบ Real-time
- ควบคุมการป้อนอาหารด้วย Preset หรือ Custom
- ตั้งค่าระบบพัดลมอัตโนมัติ

### Settings Page (NEW)
- **HX711 Calibration**: ปรับเทียบเครื่องชั่งน้ำหนักแบบ Step-by-step
- **System Status**: ติดตามสถานะ Arduino, Firebase, Camera, WebSocket
- **Timing Configuration**: ตั้งค่าช่วงเวลาอ่านเซ็นเซอร์และซิงค์ข้อมูล
- **Auto Feed Settings**: กำหนดการป้อนอาหารอัตโนมัติ

### Feed Control
- ควบคุมการป้อนอาหารแบบ Preset (Small/Medium/Large)
- ตั้งค่าการป้อนอาหารแบบ Custom (ปริมาณ, ความเร็ว, เวลา)
- ตรวจสอบสถานะการป้อนอาหารแบบ Real-time

### Temperature Control
- ตรวจสอบอุณหภูมิจากเซ็นเซอร์หลายตัว
- กราฟแสดงแนวโน้มอุณหภูมิ
- ควบคุมพัดลมระบายความร้อน

### Motor Control
- ควบคุม Auger และ Blower
- ตั้งค่า PWM Speed
- ควบคุม Actuator Up/Down

## 🧠 AI Pi Server Integration

ไฟล์ `PI_SERVER_AI_INSTRUCTION.md` มีคำแนะนำสำหรับ AI ในการอัพเดต Pi Server ให้ทำงานร่วมกับ Web App ได้ รวมถึง:

- **HX711 Calibration API**: ระบบปรับเทียบเครื่องชั่งน้ำหนัก
- **Sensor Data API**: รูปแบบการส่งข้อมูลเซ็นเซอร์
- **Feed Control API**: ระบบป้อนอาหารแบบ Custom และ Preset
- **Cooling Fan Auto Mode**: ระบบพัดลมอัตโนมัติ
- **Historical Data**: การจัดเก็บและแสดงผลข้อมูลย้อนหลัง
- **Error Handling**: การจัดการข้อผิดพลาด

## 📊 Sensor Data Structure

```json
{
  "DHT22_SYSTEM": { "temperature": 32.1, "humidity": 58.5 },
  "DHT22_FEEDER": { "temperature": 25.3, "humidity": 64.2 },
  "HX711_FEEDER": { 
    "weight": 1.384, 
    "unit": "kg", 
    "calibrated": true, 
    "mode": "auto" 
  },
  "DS18B20_WATER_TEMP": { "temperature": 27.3 },
  "SOIL_MOISTURE": { "humidity": 44.2, "percentage": 44 },
  "SOLAR_CURRENT": { "current": 0.3, "voltage": 12.1 },
  "LOAD_VOLTAGE": { "voltage": 12.1 },
  "BATTERY_STATUS": { "voltage": 12.5, "percentage": 82 }
}
```

## 🎛️ Control Commands

### HX711 Calibration Commands (NEW)
```json
{
  "action": "tare"
}

{
  "action": "calibrate",
  "weight": 1.5
}

{
  "action": "reset"
}
```

### Feed Control
```json
{
  "action": "custom",
  "amount": 100,
  "speed": 128,
  "duration": 5000,
  "actuator_up": 3,
  "actuator_down": 2,
  "auger_duration": 20,
  "blower_duration": 15
}
```

### Direct Commands
- `CAL:TARE` - Tare weight sensor
- `CAL:WEIGHT:X.XXX` - Calibrate with known weight (kg)
- `U:X.X` - Actuator Up (seconds)
- `D:X.X` - Actuator Down (seconds)
- `G:0/1/2` - Auger Control
- `B:0/1` - Blower Control
- `R:0/1/2` - Relay Control
- `SPD:XXX` - PWM Speed (0-255)

## 📈 Version History

### v2.2.0 (Current)
- ✅ **HX711 Weight Calibration System**: ระบบปรับเทียบเครื่องชั่งแบบ Step-by-step
- ✅ **Enhanced Settings Page**: หน้าตั้งค่าใหม่พร้อม System Status monitoring
- ✅ **Real-time Weight Display**: แสดงน้ำหนักปัจจุบัน 0.001 kg precision
- ✅ **3-Step Calibration Process**: Tare → Calibrate → Complete
- ✅ **System Status Dashboard**: ติดตาม Arduino, Firebase, Camera, WebSocket
- ✅ **Timing Configuration**: ตั้งค่าช่วงเวลาอ่านเซ็นเซอร์และซิงค์ข้อมูล
- ✅ **Auto Feed Management**: การจัดการระบบป้อนอาหารอัตโนมัติ
- ✅ **Production Deployment**: Firebase Hosting พร้อมใช้งาน

### v2.1.1
- ✅ แก้ไข Splash Screen - ปุ่มเข้าสู่ระบบไม่บังกับ Copyright
- ✅ เพิ่ม Project Code "B65IEE02" ให้เด่นชัด
- ✅ Real-time Dashboard อัพเดตอัตโนมัติทุก 5 วินาที
- ✅ ระบบแจ้งเตือนแบบ Live บนหน้าเว็บ
- ✅ AI Instruction สำหรับ Pi Server Integration

### v2.1.0
- ✅ Enhanced Motor PWM Control
- ✅ Real-time Firebase Dashboard
- ✅ Automatic Fan Control System
- ✅ Splash Screen with Loading Animation
- ✅ Responsive UI Improvements

## 🔗 Links

- **Live Demo**: https://fish-feeder-test-1.web.app
- **Settings Page**: https://fish-feeder-test-1.web.app/settings
- **Repository**: [GitHub Repository]
- **Documentation**: [API Documentation]

## 🏫 Team Credits

**สาขาวิชาวิศวกรรมไฟฟ้าอุตสาหการ**  
มหาวิทยาลัยเทคโนโลยีสุรนารี

**รายชื่อผู้จัดทำ:**
- นายพีรวัตน์ กองสอน (B6523404)
- นายภักรพงษ์ พิศพิง (B6523442)  
- นายสุรวิชั แสนกวีสุข (B6523497)

---

© 2024 Suranaree University of Technology  
Industrial Electrical Engineering Department 