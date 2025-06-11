# 🐟 Fish Feeder Web Application (v2.1.1)

**รหัสโปรเจค:** B65IEE02  
**สาขาวิชา:** วิศวกรรมไฟฟ้าอุตสาหการ  
**มหาวิทยาลัย:** มหาวิทยาลัยเทคโนโลยีสุรนารี

## 🎯 Project Overview

ระบบป้อนอาหารปลาอัตโนมัติแบบครบวงจร พร้อมระบบตรวจสอบและควบคุมผ่าน Web Application แบบ Real-time

### ✨ Features หลัก

- **🔄 Real-time Dashboard**: อัพเดตข้อมูลอัตโนมัติทุก 5 วินาทีโดยไม่ต้องรีเฟรชหน้า
- **📱 Responsive UI**: รองรับการใช้งานบนมือถือและแท็บเล็ต
- **🌡️ Smart Cooling Fan**: ควบคุมพัดลมระบายความร้อนแบบอัตโนมัติตามอุณหภูมิ
- **📊 Data Visualization**: แสดงผลข้อมูลแบบกราฟ Real-time
- **🔋 Power Management**: ตรวจสอบสถานะพลังงานและแบตเตอรี่
- **🎛️ Motor PWM Control**: ควบคุมมอเตอร์แบบละเอียดด้วย PWM
- **🔥 Firebase Integration**: บันทึกข้อมูลแบบ Cloud หรือใช้ Local API เป็น fallback

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting
- **Database**: Firebase Realtime Database
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📂 Project Structure

```
fish-feeder-web/
├── src/
│   ├── components/        # React Components
│   ├── pages/             # Page Components
│   ├── hooks/             # Custom Hooks
│   ├── utils/             # Utility Functions
│   └── firebase/          # Firebase Configuration
├── public/                # Static Assets
├── PI_SERVER_AI_INSTRUCTION.md  # AI Instructions for Pi Server
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
npm run deploy
```

## 🔧 Configuration

### Firebase Setup
1. สร้าง Firebase project ใหม่
2. เปิดใช้งาน Realtime Database
3. Copy config ไปใส่ใน `src/firebase/config.ts`

### Pi Server Integration
อ่านไฟล์ `PI_SERVER_AI_INSTRUCTION.md` สำหรับรายละเอียดการตั้งค่า Pi Server

## 📋 API Endpoints (Pi Server)

```
GET    /health                    - Health check
GET    /api/sensors              - Get all sensor data
POST   /api/control/feed         - Feed control
POST   /api/control/direct       - Direct command
POST   /api/control/fan-auto     - Fan auto control
GET    /api/sensors/history      - Get historical data
```

## 🎮 การใช้งาน

### Dashboard หลัก
- ตรวจสอบสถานะเซ็นเซอร์แบบ Real-time
- ควบคุมการป้อนอาหารด้วย Preset หรือ Custom
- ตั้งค่าระบบพัดลมอัตโนมัติ

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
  "HX711_FEEDER": { "weight": 1384.2, "unit": "grams" },
  "DS18B20_WATER_TEMP": { "temperature": 27.3 },
  "SOIL_MOISTURE": { "humidity": 44.2, "percentage": 44 },
  "SOLAR_CURRENT": { "current": 0.3, "voltage": 12.1 },
  "LOAD_VOLTAGE": { "voltage": 12.1 },
  "BATTERY_STATUS": { "voltage": 12.5, "percentage": 82 }
}
```

## 🎛️ Control Commands

### Feed Control
```json
{
  "action": "custom",
  "preset": "medium",
  "actuator_up": 3.5,
  "actuator_down": 3.0,
  "auger_on": 2.0,
  "blower_on": 5.0
}
```

### Direct Commands
- `U:X.X` - Actuator Up (seconds)
- `D:X.X` - Actuator Down (seconds)
- `G:0/1/2` - Auger Control
- `B:0/1` - Blower Control
- `R:0/1/2` - Relay Control
- `SPD:XXX` - PWM Speed (0-255)

## 📈 Version History

### v2.1.1 (Current)
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
- **Repository**: [GitHub Repository]
- **Documentation**: [API Documentation]

## 🏫 Team Credits

**สาขาวิชาวิศวกรรมไฟฟ้าอุตสาหการ**  
มหาวิทยาลัยเทคโนโลยีสุรนารี

**รายชื่อผู้จัดทำ:**
- นายกิตวัฒน์ กลมลอก (B6523404)
- นายกิตติพงษ์ ปัตตัง (B6523442)
- นายสิรวิท แสนกรวย (B6523497)

---

© 2024 Suranaree University of Technology  
Industrial Electrical Engineering Department 