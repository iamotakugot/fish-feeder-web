# คู่มือการติดตั้ง Backend API สำหรับ Fish Feeder

## ภาพรวม
เว็บแอปพลิเคชั่น Fish Feeder นี้ถูกออกแแบบให้ทำงานกับ Backend API Server ที่รันบน Raspberry Pi หรือเครื่องคอมพิวเตอร์ที่เชื่อมต่อกับ Arduino และ sensor ต่างๆ

## การตั้งค่า Backend Server

### 1. ตัวอย่าง Backend API Structure
Backend server ควรมี endpoints ดังนี้:

```
GET /api/health          - ตรวจสอบสถานะระบบ
GET /api/sensors         - ดึงข้อมูล sensor ทั้งหมด
GET /api/status          - ดึงสถานะระบบ
POST /api/control        - ควบคุมอุปกรณ์
POST /api/feed           - ให้อาหาร
GET /api/camera/video_feed - video stream จากกล้อง
```

### 2. รูปแบบข้อมูล Sensor
Backend ควร return ข้อมูลในรูปแบบนี้:

```json
{
  "status": "success",
  "sensors": {
    "feed_tank": {
      "temperature": 25.5,
      "humidity": 65,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "control_box": {
      "temperature": 28.2,
      "humidity": 58,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "water": {
      "temperature": 24.0,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "weight": {
      "value": 2.5,
      "unit": "kg",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "soil": {
      "moisture": 75,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "power": {
      "battery_voltage": 12.5,
      "solar_current": 2.1,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 3. รูปแบบข้อมูล System Status
```json
{
  "status": "success",
  "system": {
    "arduino_connected": true,
    "last_heartbeat": "2024-01-15T10:30:00Z",
    "relay_states": {
      "led": false,
      "fan": true
    },
    "auger_state": "stopped",
    "blower_state": false,
    "actuator_state": "stopped"
  }
}
```

## การทดสอบการเชื่อมต่อ

### 1. ใช้งาน Debug Panel
- เปิดเว็บแอป และคลิก "Debug" ที่มุมบนขวา
- คลิก "Test API" เพื่อทดสอบการเชื่อมต่อ
- ดูผลลัพธ์ใน Browser Console (F12)

### 2. ทดสอบผ่าน Browser Console
เปิด Developer Tools (F12) และพิมพ์:
```javascript
// ทดสอบการเชื่อมต่อ API
testApi()

// ดึงข้อมูล sensor
getSensorReadings().then(console.log)

// ดูสถานะระบบ
getSystemStatus().then(console.log)
```

### 3. ทดสอบด้วย curl/Postman
```bash
# ทดสอบ health check
curl http://localhost:5000/api/health

# ทดสอบ sensor data
curl http://localhost:5000/api/sensors

# ทดสอบ system status
curl http://localhost:5000/api/status
```

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย:

1. **Connection Failed**
   - ตรวจสอบว่า Backend server รันอยู่หรือไม่
   - ตรวจสอบ port และ URL ใน `src/config/api.ts`
   - ตรวจสอบ firewall และ network

2. **CORS Error**
   - Backend server ต้อง enable CORS
   - หรือรัน frontend และ backend บน domain เดียวกัน

3. **Sensor Data ไม่แสดง**
   - ตรวจสอบ Arduino connection
   - ตรวจสอบ serial port และ baud rate
   - ดู log ใน Backend server

4. **Camera ไม่แสดง**
   - ตรวจสอบ camera connection
   - ตรวจสอบ video stream endpoint
   - ลองเปลี่ยน camera resolution

## การปรับแต่ง

### 1. เปลี่ยน API URL
แก้ไขไฟล์ `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_RASPBERRY_PI_IP:5000',
  // หรือ
  BASE_URL: 'https://your-domain.com',
}
```

### 2. ปรับ Refresh Rate
แก้ไขใน `src/pages/Dashboard.tsx`:
```typescript
// เปลี่ยนจาก 3000ms เป็นค่าที่ต้องการ
const interval = setInterval(() => {
  refreshSensors();
  refreshStatus();
}, 5000); // 5 วินาที
```

### 3. เพิ่ม Sensor ใหม่
1. อัพเดท interface ใน `src/config/api.ts`
2. เพิ่มการแสดงผลใน `src/pages/Dashboard.tsx`
3. ทดสอบกับ Backend API

## ตัวอย่าง Backend Code

### Python Flask Example:
```python
from flask import Flask, jsonify
from flask_cors import CORS
import serial
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Arduino connection
arduino = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'success',
        'arduino_connected': arduino.is_open,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/sensors')
def get_sensors():
    # อ่านข้อมูลจาก Arduino
    arduino.write(b'GET_SENSORS\n')
    data = arduino.readline().decode().strip()
    
    try:
        sensor_data = json.loads(data)
        return jsonify({
            'status': 'success',
            'sensors': sensor_data
        })
    except:
        return jsonify({
            'status': 'error',
            'message': 'Failed to read sensor data'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## การใช้งานจริง

1. **เตรียม Hardware**
   - Raspberry Pi / PC
   - Arduino พร้อม sensors
   - Camera (optional)

2. **ติดตั้ง Backend Server**
   - ใช้ Python Flask หรือ Node.js Express
   - เชื่อมต่อกับ Arduino ผ่าน Serial
   - เปิด CORS และ configure endpoints

3. **รัน Frontend**
   ```bash
   npm run dev
   ```

4. **ทดสอบระบบ**
   - ใช้ Debug Panel
   - ตรวจสอบ Console logs
   - ตรวจสอบข้อมูล sensor real-time

หากมีปัญหาหรือต้องการความช่วยเหลือเพิ่มเติม สามารถดูได้จาก Console logs หรือติดต่อทีมพัฒนา 