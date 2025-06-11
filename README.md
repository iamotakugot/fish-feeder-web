# 🐟 Stand-Alone Automatic Fish Feeder (IoT System)

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Firebase](https://img.shields.io/badge/firebase-hosting-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 ภาพรวมโปรเจค

**Stand-Alone Automatic Fish Feeder** เป็นระบบป้อนอาหารปลาอัตโนมัติที่ใช้เทคโนโลยี Internet of Things (IoT) พัฒนาโดยนักศึกษาวิศวกรรมไฟฟ้าอุตสาหกรรม มหาวิทยาลัยเทคโนโลยีสุรนารี

### 🎯 วัตถุประสงค์
- พัฒนาระบบป้อนอาหารปลาที่ทำงานอัตโนมัติ
- ควบคุมและตรวจสอบผ่านเว็บแอปพลิเคชัน
- บูรณาการระบบ IoT เพื่อการจัดการระยะไกล
- ประยุกต์ใช้เทคโนโลยีสมัยใหม่ในการเลี้ยงปลา

## 🚀 Live Demo

**เข้าใช้งานได้ที่: [https://fish-feeder-test-1.web.app](https://fish-feeder-test-1.web.app)**

## ✨ คุณสมบัติหลัก

### 🎛️ การควบคุมระบบ
- **Dashboard แบบ Real-time**: แสดงสถานะปัจจุบันของระบบ
- **Manual Feed Control**: ป้อนอาหารด้วยตนเองผ่านเว็บ
- **Scheduled Feeding**: ตั้งเวลาป้อนอาหารอัตโนมัติ
- **Motor PWM Control**: ควบคุมความเร็วมอเตอร์และปริมาณอาหาร

### 🌡️ ระบบควบคุมอุณหภูมิ
- **Temperature Monitoring**: ตรวจสอบอุณหภูมิด้วย DHT22 (PIN 48)
- **Auto Fan Control**: ควบคุมพัดลมอัตโนมัติผ่าน Relay (PIN 52)
- **Smart Threshold**: ตั้งค่าอุณหภูมิและ Hysteresis
- **Real-time Sync**: ซิงค์ข้อมูลทุก 5 วินาที

### 📊 ระบบจัดการข้อมูล
- **Firebase Integration**: เก็บข้อมูลบน Firebase Realtime Database
- **Analytics & Reports**: วิเคราะห์ข้อมูลการป้อนอาหาร
- **Export Data**: ส่งออกข้อมูลเป็นไฟล์ JSON
- **Auto Backup**: สำรองข้อมูลอัตโนมัติ

### 📱 User Experience
- **Responsive Design**: ใช้งานได้ทั้ง Desktop และ Mobile
- **Dark/Light Theme**: เปลี่ยนธีมตามต้องการ
- **Splash Screen**: หน้าต้อนรับแบบมืออาชีพ
- **Modern UI**: ใช้ HeroUI และ Tailwind CSS

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web App       │────▶│   Firebase      │────▶│   Pi Server     │
│   (Frontend)    │     │   (Database)    │     │   (Backend)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │   Arduino       │
                                                │   (Hardware)    │
                                                └─────────────────┘
```

### 🔧 เทคโนโลยีที่ใช้

#### Frontend (Web Application)
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** + **HeroUI** (UI Framework)
- **Firebase SDK** (Database Integration)
- **Framer Motion** (Animations)
- **React Router** (Navigation)

#### Backend & Hardware
- **Python** (Pi Server)
- **Firebase Realtime Database**
- **Arduino** (Hardware Control)
- **DHT22** Temperature Sensor
- **Servo Motors** & **Relay Modules**

#### DevOps & Deployment
- **Firebase Hosting**
- **Git** Version Control
- **NPM** Package Management

## 📦 การติดตั้งและใช้งาน

### 📋 ความต้องการระบบ
- Node.js 16+ 
- NPM หรือ Yarn
- Git
- Firebase CLI (สำหรับ deploy)

### 🛠️ ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/your-username/fish-feeder-web.git
cd fish-feeder-web
```

2. **ติดตั้ง Dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **ตั้งค่า Firebase**
```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login Firebase
firebase login

# เริ่มต้นโปรเจค
firebase init
```

4. **รัน Development Server**
```bash
npm run dev
```

5. **Build สำหรับ Production**
```bash
npm run build
```

6. **Deploy ไปยัง Firebase**
```bash
firebase deploy
```

## 🎮 การใช้งาน

### 1. 🏠 Dashboard
- ดูสถานะปัจจุบันของระบบ
- แสดงกราฟข้อมูลแบบ Real-time
- ตรวจสอบการเชื่อมต่อ

### 2. 🍽️ Feed Control
- ป้อนอาหารด้วยตนเอง
- ตั้งเวลาป้อนอาหารอัตโนมัติ
- ปรับปริมาณอาหาร

### 3. 🌡️ Temperature Control
- ตรวจสอบอุณหภูมิห้องควบคุม
- ตั้งค่าอุณหภูมิเปิด/ปิดพัดลม
- โหมดอัตโนมัติ/ด้วยตนเอง

### 4. ⚙️ Motor & PWM Settings
- ควบคุมมอเตอร์ Auger
- ปรับค่า PWM Speed
- ควบคุมพัดลมระบายอากาศ

### 5. 🔧 Settings
- ตั้งค่าระบบทั่วไป
- การแจ้งเตือน
- บำรุงรักษาระบบ
- ส่งออกข้อมูล

## 📁 โครงสร้างโปรเจค

```
fish-feeder-web/
├── public/                 # Static files
├── src/
│   ├── components/         # React Components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── theme-switch.tsx
│   ├── pages/             # Page Components
│   │   ├── Dashboard.tsx
│   │   ├── FeedControl.tsx
│   │   ├── FanTempControl.tsx
│   │   ├── MotorPWM.tsx
│   │   ├── Settings.tsx
│   │   └── SplashScreen.tsx
│   ├── utils/             # Utility Functions
│   │   ├── api.ts
│   │   └── firebaseSensorUtils.ts
│   ├── App.tsx            # Main App Component
│   └── main.tsx           # Entry Point
├── tailwind.config.js     # Tailwind Configuration
├── vite.config.ts         # Vite Configuration
├── firebase.json          # Firebase Configuration
└── package.json           # Dependencies
```

## 🔌 API Documentation

### Pi Server Endpoints

#### 🍽️ Feed Control
```bash
# Manual Feed
POST /feed
{
  "amount": 100,
  "duration": 3
}

# Get Feed Status
GET /feed/status

# Schedule Feed
POST /feed/schedule
{
  "time": "08:00",
  "amount": 50,
  "enabled": true
}
```

#### 🌡️ Temperature Control
```bash
# Get Temperature
GET /temperature

# Set Fan Control
POST /fan/control
{
  "mode": "auto",
  "threshold": 30,
  "hysteresis": 2
}

# Manual Fan Control
POST /fan/manual
{
  "state": "on" | "off"
}
```

#### ⚙️ Motor Control
```bash
# Auger Control
POST /motor/auger
{
  "action": "forward" | "reverse" | "stop",
  "speed": 255,
  "duration": 5
}

# Blower Control
POST /motor/blower
{
  "speed": 128,
  "duration": 10
}
```

## 📈 เวอร์ชัน 2.1.0 (ปัจจุบัน)

### ✅ Enhanced Features
- **Professional Splash Screen**: หน้าต้อนรับแบบมืออาชีพพร้อม animation
- **Improved Tab Menu**: ปรับปรุง UI ให้ responsive ทั้ง mobile และ desktop
- **Auto Fan Control System**: ระบบควบคุมพัดลมอัตโนมัติด้วย DHT22
- **Firebase Real-time Sync**: ซิงค์ข้อมูลแบบ real-time ทุก 5 วินาที
- **Enhanced Settings Page**: ปรับปรุงหน้า Settings ให้มีประโยชน์มากขึ้น
- **Data Export/Backup**: ระบบส่งออกและสำรองข้อมูล
- **Performance Optimization**: เพิ่มประสิทธิภาพการทำงาน

### 🔧 System Improvements
- Inter และ Roboto fonts สำหรับความสวยงาม
- Responsive design ที่ทำงานได้ดีทั้ง mobile และ desktop
- ปรับปรุง navigation และ user experience
- เพิ่มระบบ maintenance และ monitoring

## 👥 ทีมพัฒนา

### 🎓 รายชื่อคณะผู้จัดทำ

| รหัสนักศึกษา | ชื่อ-นามสกุล | บทบาท |
|-------------|------------|-------|
| **B6523404** | นายพีรวัตน์ กองสอน | Lead Developer |
| **B6523442** | นายภักรพงษ์ พิศพิง | Hardware Engineer |
| **B6523497** | นายสุรวิชั แสนกวีสุข | System Analyst |

### 🏫 สถาบัน
**วิศวกรรมไฟฟ้าอุตสาหกรรม**  
**สำนักวิชาวิศวกรรมศาสตร์**  
**มหาวิทยาลัยเทคโนโลยีสุรนารี**

## 📄 License

This project is licensed under the MIT License.

## 📞 ติดต่อ

- **Web Demo**: [https://fish-feeder-test-1.web.app](https://fish-feeder-test-1.web.app)
- **University**: [มหาวิทยาลัยเทคโนโลยีสุรนารี](https://www.sut.ac.th)

---

## 🙏 ขอบคุณ

ขอบคุณทุกท่านที่ให้การสนับสนุนโปรเจคนี้ และขอบคุณ Open Source Community ที่ทำให้โปรเจคนี้เป็นไปได้

**Made with ❤️ by SUT Industrial Electrical Engineering Students**

---

*© 2024 Suranaree University of Technology. All rights reserved.* 