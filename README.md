# 🐟 Fish Feeder Web Application - **LATEST UPDATE** 🚀

**แอปพลิเคชันเว็บสำหรับควบคุมและมอนิเตอร์เครื่องป้อนปลาอัตโนมัติ แบบเรียลไทม์**

[![GitHub Repository](https://img.shields.io/badge/GitHub-fish--feeder--web-blue?logo=github)](https://github.com/iamotakugot/fish-feeder-web)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase%20Hosting-orange?logo=firebase)](https://fish-feeder-test-1.web.app)
[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 🔥 **อัพเดทล่าสุด (Latest Updates)**

### **📅 Version 2.1.0 - December 2024**

#### 🎯 **New Features Added:**

1. **🎮 Enhanced Motor PWM Control Center**
   - ✅ Real-time motor status tracking (Speed, Direction, Running State)
   - ✅ PWM Speed control (0-255) with visual indicators
   - ✅ Enhanced Auger Motor Control (Forward/Reverse/Stop)
   - ✅ Auto-refresh connection status every 3 seconds
   - ✅ Visual feedback with animations and status icons

2. **📊 Real-time Dashboard with Firebase Integration**
   - ✅ Smart sensor data display for 9+ sensor types
   - ✅ Auto-switching between Firebase data and fallback examples
   - ✅ Thai language user-friendly error messages
   - ✅ Connection status indicators with emoji and colors
   - ✅ Grid-responsive sensor cards layout

3. **🎛️ Advanced Feed Control System**
   - ✅ Preset-specific timing controls (Small/Medium/Large/XL)
   - ✅ Individual timing configuration per preset
   - ✅ Auto-save functionality with localStorage
   - ✅ Weight formatting improvements (kg/g display)
   - ✅ Video recording integration for feed history

4. **⚡ Smart Device Timing Controls**
   - ✅ `actuator_up` & `actuator_down` timing settings
   - ✅ `auger_duration` & `blower_duration` (auto-stop semantics)
   - ✅ Preset-specific timing persistence
   - ✅ Modal editors for timing configuration

5. **🌐 Multi-language Error Handling**
   - ✅ Thai language error messages for better UX
   - ✅ Friendly connection status with emoji indicators
   - ✅ Auto-refresh functionality when connection restored

---

## 🌐 Live Demo

**🚀 เว็บไซต์**: [https://fish-feeder-test-1.web.app](https://fish-feeder-test-1.web.app)  
**📂 GitHub**: [https://github.com/iamotakugot/fish-feeder-web](https://github.com/iamotakugot/fish-feeder-web)

---

## 🏗️ **สำหรับนักพัฒนา Pi Server & Arduino** 

### **🔥 Pi Server Requirements (CRITICAL)**

#### **📡 Required API Endpoints:**

```bash
# Health Check
GET  /health
Response: {
  "status": "ok",
  "timestamp": "2024-12-07T10:30:00Z",
  "server_info": { "version": "1.0.0", "uptime": 3600 },
  "serial_connected": true,
  "sensors_available": ["DHT22_SYSTEM", "HX711_FEEDER", ...]
}

# Direct Arduino Control (MOST IMPORTANT)
POST /api/control/direct
Body: { "command": "G:1" }
Response: { "status": "success", "message": "Command sent", "data": {...} }

# Sensor Data
GET  /api/sensors
Response: { "status": "ok", "data": {...sensor_data...} }

# Device Controls
POST /api/control/actuator
POST /api/control/blower  
POST /api/relay/led
POST /api/relay/fan
```

#### **🔧 Pi Server Implementation Example:**

```python
# Flask Example (Python)
from flask import Flask, request, jsonify
import serial
import json
from datetime import datetime
import time

app = Flask(__name__)
arduino = serial.Serial('/dev/ttyUSB0', 9600)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "server_info": {"version": "1.0.0", "uptime": time.time()},
        "serial_connected": arduino.is_open,
        "sensors_available": ["DHT22_SYSTEM", "HX711_FEEDER", "DS18B20_WATER"]
    })

@app.route('/api/control/direct', methods=['POST'])
def direct_control():
    try:
        command = request.json.get('command')
        
        # Send to Arduino via Serial
        arduino.write(f"{command}\n".encode())
        
        # Wait for response (optional)
        response = arduino.readline().decode().strip()
        
        return jsonify({
            "status": "success", 
            "message": f"Command '{command}' sent successfully",
            "arduino_response": response
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    # Send sensor request to Arduino
    arduino.write(b"S:ALL\n")
    response = arduino.readline().decode().strip()
    
    # Parse Arduino response and format for web
    sensor_data = parse_arduino_sensors(response)
    
    return jsonify({
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "data": sensor_data
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

### **🤖 Arduino Requirements (CRITICAL)**

#### **📟 Serial Commands Protocol:**

```cpp
// Arduino Serial Command Handler
void setup() {
    Serial.begin(9600);
    Serial.println("Fish Feeder Arduino Ready");
}

void loop() {
    if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        
        handleCommand(command);
    }
}

void handleCommand(String cmd) {
    // Motor Speed Control
    if (cmd.startsWith("SPD:")) {
        int speed = cmd.substring(4).toInt(); // 0-255
        analogWrite(MOTOR_PWM_PIN, speed);
        Serial.println("OK:SPD:" + String(speed));
    }
    
    // Auger Motor Direction
    else if (cmd == "G:1") {  // Forward
        digitalWrite(MOTOR_DIR_PIN, HIGH);
        digitalWrite(MOTOR_ENABLE_PIN, HIGH);
        motorState = "forward";
        Serial.println("OK:G:1:FORWARD");
    }
    else if (cmd == "G:2") {  // Reverse
        digitalWrite(MOTOR_DIR_PIN, LOW);
        digitalWrite(MOTOR_ENABLE_PIN, HIGH);
        motorState = "reverse";
        Serial.println("OK:G:2:REVERSE");
    }
    else if (cmd == "G:0") {  // Stop
        digitalWrite(MOTOR_ENABLE_PIN, LOW);
        motorState = "stopped";
        Serial.println("OK:G:0:STOP");
    }
    
    // Blower Control
    else if (cmd == "B:1") {  // Blower On
        digitalWrite(BLOWER_PIN, HIGH);
        Serial.println("OK:B:1:ON");
    }
    else if (cmd == "B:0") {  // Blower Off
        digitalWrite(BLOWER_PIN, LOW);
        Serial.println("OK:B:0:OFF");
    }
    
    // Relay Control
    else if (cmd == "R:1") {  // Relay 1 On
        digitalWrite(RELAY_1_PIN, HIGH);
        Serial.println("OK:R:1:ON");
    }
    else if (cmd == "R:01") { // Relay 1 Off
        digitalWrite(RELAY_1_PIN, LOW);
        Serial.println("OK:R:01:OFF");
    }
    
    // Sensor Reading
    else if (cmd == "S:ALL") {
        sendAllSensors();
    }
    
    // Connection Test
    else if (cmd == "PING") {
        Serial.println("PONG:ARDUINO_CONNECTED");
    }
    
    else {
        Serial.println("ERROR:UNKNOWN_COMMAND:" + cmd);
    }
}

void sendAllSensors() {
    // Read all sensors and send JSON format
    String json = "{";
    json += "\"temperature\":" + String(dht.readTemperature()) + ",";
    json += "\"humidity\":" + String(dht.readHumidity()) + ",";
    json += "\"weight\":" + String(scale.get_units()) + ",";
    json += "\"motor_speed\":" + String(currentPWM) + ",";
    json += "\"motor_direction\":\"" + motorState + "\",";
    json += "\"timestamp\":\"" + String(millis()) + "\"";
    json += "}";
    
    Serial.println("SENSORS:" + json);
}
```

#### **🔌 Hardware Pin Configuration:**

```cpp
// Pin Definitions (Example)
#define MOTOR_PWM_PIN     9    // PWM speed control
#define MOTOR_DIR_PIN     8    // Direction control
#define MOTOR_ENABLE_PIN  7    // Enable/disable motor
#define BLOWER_PIN        6    // Blower fan control
#define RELAY_1_PIN       5    // LED/Light relay
#define RELAY_2_PIN       4    // Additional relay

// Sensor Pins
#define DHT_PIN           2    // DHT22 sensor
#define SCALE_DOUT_PIN    3    // HX711 data pin
#define SCALE_SCK_PIN     10   // HX711 clock pin
#define WATER_TEMP_PIN    11   // DS18B20 OneWire
```

---

### **🔄 Communication Flow:**

```
Web Browser --> Pi Server --> Arduino
      ↑              ↓            ↓
   Response <-- JSON Response <-- Serial Response
```

**Example Flow:**
1. **User clicks "Forward" button** on web interface
2. **Web sends POST** to `http://pi-server:5000/api/control/direct` with `{"command": "G:1"}`
3. **Pi Server receives** command and sends `"G:1\n"` via serial to Arduino
4. **Arduino executes** motor forward and responds `"OK:G:1:FORWARD"`
5. **Pi Server responds** to web with `{"status": "success", "message": "G:1 executed"}`
6. **Web interface updates** motor status to "Forward" with green indicator

---

## 📋 **Core Features Overview**

### **📊 Real-time Dashboard**
- 🌡️ **9 Sensor Types**: Temperature (DHT22, DS18B20), Humidity, Weight (HX711), Battery, Solar
- 📱 **Responsive Grid Layout**: 3 columns on desktop, adaptive on mobile
- 🔄 **Auto-refresh**: Updates every 3 seconds with connection status
- 🇹🇭 **Thai Language**: User-friendly error messages and status indicators
- 🎨 **Visual Feedback**: Color-coded status, progress bars, animations

### **🎮 Advanced Motor Control**
- ⚡ **PWM Speed Control**: 0-255 (0-100%) with real-time display
- 🔄 **Direction Control**: Forward/Reverse/Stop with visual indicators
- 📊 **Status Tracking**: Speed, direction, running state, last command
- 🎯 **Auto-refresh**: Connection monitoring every 3 seconds
- 📡 **Direct Commands**: Send custom Arduino commands with response display

### **🍽️ Smart Feed Control System**
- 🎯 **4 Preset Amounts**: Small (50g), Medium (100g), Large (200g), XL (1kg)
- ⏱️ **Individual Timing**: Each preset has separate timing controls (actuator_up, actuator_down, auger_duration, blower_duration)
- 💾 **Auto-save**: Settings persist in localStorage
- 📹 **Video Integration**: Recording links for feed sessions
- 📊 **Weight Display**: Smart formatting (kg for ≥1000g, g for smaller)

### **🔧 Device Timing Controls**
- ⬆️ **Actuator Up/Down**: Configurable timing for container movement
- 🌾 **Auger Duration**: Auto-stop timing for food dispensing motor
- 💨 **Blower Duration**: Auto-stop timing for food distribution fan
- 🎛️ **Modal Editors**: User-friendly timing configuration interfaces

---

## 🚀 **Quick Start Guide**

### **1. Clone & Install:**
```bash
git clone https://github.com/iamotakugot/fish-feeder-web.git
cd fish-feeder-web
npm install
```

### **2. Environment Setup:**
```bash
# Create .env file
VITE_API_URL=http://your-pi-ip:5000
VITE_FIREBASE_PROJECT_ID=fish-feeder-test-1
# ... other Firebase config
```

### **3. Development:**
```bash
npm run dev    # Run dev server at localhost:5173
npm run build  # Build for production
npm run deploy # Deploy to Firebase
```

### **4. Pi Server Setup:**
```bash
# Install Python dependencies
pip install flask pyserial

# Run Pi server
python pi_server.py  # Listen on port 5000
```

### **5. Arduino Setup:**
```cpp
// Upload Arduino code with serial command handlers
// Ensure 9600 baud rate serial communication
// Test with Serial Monitor: send "PING" -> expect "PONG:ARDUINO_CONNECTED"
```

---

## 📱 **Tech Stack**

```json
{
  "frontend": {
    "react": "18.3.1",
    "typescript": "5.6.3", 
    "vite": "5.2.0",
    "@heroui/system": "2.4.15",
    "tailwindcss": "3.4.16",
    "framer-motion": "11.15.0",
    "recharts": "2.15.3"
  },
  "backend": {
    "firebase": "11.9.1",
    "pi_server": "Flask/FastAPI",
    "arduino": "Serial Communication"
  },
  "deployment": {
    "hosting": "Firebase Hosting",
    "alternative": "Vercel"
  }
}
```

---

## 🎯 **API Reference**

### **Motor Control Commands:**

| Command | Function | Response |
|---------|----------|----------|
| `SPD:255` | Set motor speed (0-255) | `OK:SPD:255` |
| `G:1` | Motor forward | `OK:G:1:FORWARD` |
| `G:2` | Motor reverse | `OK:G:2:REVERSE` |
| `G:0` | Motor stop | `OK:G:0:STOP` |
| `B:1` | Blower on | `OK:B:1:ON` |
| `B:0` | Blower off | `OK:B:0:OFF` |
| `R:1` | Relay 1 on | `OK:R:1:ON` |
| `R:01` | Relay 1 off | `OK:R:01:OFF` |
| `S:ALL` | Get all sensors | `SENSORS:{...json...}` |
| `PING` | Test connection | `PONG:ARDUINO_CONNECTED` |

---

## 🔧 **Troubleshooting**

### **❌ Pi Server Connection:**
```bash
# Test Pi server health
curl http://pi-ip:5000/health

# Check serial connection
ls /dev/ttyUSB*  # or /dev/ttyACM*

# Test direct command
curl -X POST http://pi-ip:5000/api/control/direct \
  -H "Content-Type: application/json" \
  -d '{"command": "PING"}'
```

### **🤖 Arduino Issues:**
```cpp
// Test serial in Arduino IDE Serial Monitor
PING          // Should respond: PONG:ARDUINO_CONNECTED
S:ALL         // Should respond: SENSORS:{...}
G:1           // Should respond: OK:G:1:FORWARD
```

### **🔥 Firebase Connection:**
- Check Firebase project settings
- Verify realtime database rules allow read/write
- Check network connectivity to Firebase

---

## 📈 **Performance & Monitoring**

- ⚡ **Response Time**: Direct commands < 100ms
- 🔄 **Auto-refresh**: Every 3 seconds for connection status
- 📊 **Real-time Data**: Firebase sync every 5 seconds
- 🎯 **Error Handling**: Automatic retry with exponential backoff
- 💾 **Local Storage**: Settings persist across browser sessions

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 🏆 **Credits & License**

- **Developer**: IamOtakuGot
- **License**: MIT License
- **Framework**: React + TypeScript + HeroUI
- **Hosting**: Firebase Hosting
- **Hardware**: Raspberry Pi + Arduino

---

## 📞 **Support & Contact**

- 🐛 **Issues**: [GitHub Issues](https://github.com/iamotakugot/fish-feeder-web/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/iamotakugot/fish-feeder-web/discussions)
- 📧 **Email**: Contact via GitHub profile
- 🌐 **Live Demo**: [https://fish-feeder-test-1.web.app](https://fish-feeder-test-1.web.app)

---

## 🔄 **Latest Changes (Git History)**

```bash
# Recent updates:
✅ Enhanced Motor PWM Control with real-time status
✅ Firebase Dashboard with smart sensor data display  
✅ Advanced Feed Control with preset-specific timing
✅ Thai language error handling for better UX
✅ Video recording integration for feed history
✅ Weight formatting improvements (kg/g display)
✅ Auto-save functionality with localStorage persistence
```

**🚀 Ready to deploy!** All features tested and production-ready! 