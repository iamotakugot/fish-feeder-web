# 🧠 AI Instruction for `pi-mqtt-server` (Fish Feeder Pi Controller v3.0)

กรุณาอัปเดตระบบ Pi Server ให้สามารถทำงานร่วมกับ Web App ตามโครงสร้างใหม่ได้ โดย **อ่านข้อมูลประกอบจาก folder:**

```
D:\iee-02-project-end-game\fish-feeder-web
```

## ✅ สิ่งที่ต้องอัปเดตใน Pi Server:

### 1. **Sensor Data API (GET /api/sensors)**

* ต้องส่งข้อมูล sensor ทั้งหมดในโครงสร้าง JSON ที่ตรงกับ Firebase structure
* ตัวอย่าง key: `DHT22_SYSTEM`, `HX711_FEEDER`, `DS18B20_WATER_TEMP`, `SOIL_MOISTURE`, `SOLAR_CURRENT`, `LOAD_VOLTAGE`, `BATTERY_STATUS`
* หาก Firebase ไม่เชื่อม → Web App จะ fallback มาเรียก endpoint นี้แทน

**Expected Response Format:**
```json
{
  "timestamp": "2025-06-11T14:00:00Z",
  "DHT22_SYSTEM": {
    "temperature": 32.1,
    "humidity": 58.5,
    "pin": 48
  },
  "DHT22_FEEDER": {
    "temperature": 25.3,
    "humidity": 64.2
  },
  "HX711_FEEDER": {
    "weight": 1384.2,
    "unit": "grams"
  },
  "DS18B20_WATER_TEMP": {
    "temperature": 27.3
  },
  "SOIL_MOISTURE": {
    "humidity": 44.2,
    "percentage": 44
  },
  "SOLAR_CURRENT": {
    "current": 0.3,
    "voltage": 12.1
  },
  "LOAD_VOLTAGE": {
    "voltage": 12.1
  },
  "BATTERY_STATUS": {
    "voltage": 12.5,
    "percentage": 82
  }
}
```

### 2. **Feeding Control (POST /api/control/feed)**

* รองรับ payload แบบใหม่จาก Web App:

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

* ต้องแปลงเป็น serial command ที่ Arduino เข้าใจ เช่น:

```
U:3.5          (Actuator Up for 3.5 seconds)
G:1            (Start Auger)
B:1            (Start Blower)
Wait auger_on seconds → G:0
Wait blower_on seconds → B:0
D:3.0          (Actuator Down for 3.0 seconds)
```

**Response Format:**
```json
{
  "status": "success",
  "message": "Feed sequence completed",
  "duration": 8.5,
  "commands_sent": ["U:3.5", "G:1", "B:1", "G:0", "B:0", "D:3.0"]
}
```

### 3. **Relay & Motor Control (POST /api/control/direct)**

* ต้องรองรับ command ที่มาจาก Web App ตรง ๆ เช่น `R:1`, `G:2`, `SPD:100`
* ส่งผ่าน Serial → Arduino แล้วตอบกลับ

**Request Format:**
```json
{
  "command": "R:1",
  "device": "relay",
  "description": "Turn on relay"
}
```

**Response Format:**
```json
{
  "status": "success",
  "command_sent": "R:1",
  "arduino_response": "OK",
  "timestamp": "2025-06-11T14:00:00Z"
}
```

### 4. **Health Check (GET /health)**

* เพิ่ม key ใหม่ให้ตรงกับ Web App UI:

```json
{
  "status": "ok",
  "serial_connected": true,
  "firebase_connected": false,
  "server_info": { 
    "version": "3.0.0",
    "uptime": "2 days 3 hours",
    "project_code": "B65IEE02"
  },
  "sensors_available": [
    "DHT22_SYSTEM", 
    "DHT22_FEEDER", 
    "HX711_FEEDER", 
    "DS18B20_WATER_TEMP",
    "SOIL_MOISTURE",
    "SOLAR_CURRENT",
    "LOAD_VOLTAGE", 
    "BATTERY_STATUS"
  ],
  "arduino_info": {
    "connected": true,
    "last_response": "2025-06-11T14:00:00Z",
    "port": "/dev/ttyUSB0",
    "baud_rate": 9600
  }
}
```

### 5. **Log ข้อมูล Sensor (หาก Firebase ใช้งานไม่ได้)**

* บันทึกไฟล์ log แยกตามวันใน path:

```
/logs/YYYY-MM-DD/sensor_log.txt
/logs/YYYY-MM-DD/command_log.txt
/logs/YYYY-MM-DD/error_log.txt
```

* รูปแบบข้อมูลควรเป็น JSON พร้อม timestamp
* หาก Firebase กลับมาเชื่อมได้ → sync log file ขึ้น Firebase แล้ว mark ว่าซิงค์แล้ว

**Log Format Example:**
```json
{"timestamp": "2025-06-11T14:00:00Z", "type": "sensor", "data": {"DHT22_SYSTEM": {"temperature": 32.1, "humidity": 58.5}}}
{"timestamp": "2025-06-11T14:00:05Z", "type": "command", "data": {"command": "R:1", "response": "OK"}}
{"timestamp": "2025-06-11T14:00:10Z", "type": "error", "data": {"error": "Serial timeout", "details": "Arduino not responding"}}
```

### 6. **Cooling Fan Auto Mode (Relay IN1, PIN 52)**

* ใช้เซ็นเซอร์ DHT22 ที่ PIN 48 (`DHT22_SYSTEM`) เป็นตัวตรวจจับอุณหภูมิ
* หากอุณหภูมิสูงกว่า Threshold (default = 40°C) ให้เปิดพัดลม (Relay IN1)
* หากต่ำกว่า Threshold - Hysteresis (default = 2°C) ให้ปิดพัดลม
* ต้องรองรับการตั้งค่าผ่าน Web App โดยส่งผ่าน API เช่น:

**POST /api/control/fan-auto**
```json
{
  "mode": "auto",
  "threshold": 40,
  "hysteresis": 2,
  "update_interval": 3,
  "fan_speed": 255
}
```

* ให้ส่งคำสั่ง `R:2` (เปิด Relay IN1) และ `R:0` (ปิด Relay IN1) ผ่าน Serial → Arduino ตามเงื่อนไขที่กำหนด
* เพิ่มสถานะการควบคุมลงใน `/api/sensors` เช่น:

```json
"fan_control": {
  "auto_mode": true,
  "fan_status": "ON",
  "current_temp": 42.1,
  "threshold": 40,
  "hysteresis": 2,
  "fan_speed": 255,
  "relay_pin": 52,
  "last_update": "2025-06-11T14:00:00Z"
}
```

**Auto Control Logic:**
```python
if auto_mode:
    current_temp = sensor_data['DHT22_SYSTEM']['temperature']
    
    if fan_status == "OFF" and current_temp > threshold:
        send_command("R:2")  # Turn ON fan
        fan_status = "ON"
        
    elif fan_status == "ON" and current_temp < (threshold - hysteresis):
        send_command("R:0")  # Turn OFF fan
        fan_status = "OFF"
```

### 7. **Pi Server API Port**

* ต้องเปิด REST API ที่ `http://localhost:5000` (หรือ IP ที่เข้าจาก LAN ได้)
* Web App จะเรียก API นี้โดยตรงทุก 3–5 วินาที
* รองรับ CORS สำหรับ Web App ที่รันบน port อื่น

**API Endpoints Summary:**
```
GET    /health                    - Health check
GET    /api/sensors              - Get all sensor data
POST   /api/control/feed         - Feed control
POST   /api/control/direct       - Direct command
POST   /api/control/fan-auto     - Fan auto control
GET    /api/logs/:date           - Get logs by date
POST   /api/logs/sync            - Sync logs to Firebase
```

### 8. **รองรับการพัฒนา Web App ที่เน้นใช้งานง่าย + การแสดงผลแบบกราฟ**

* ต้องส่งข้อมูล sensor พร้อม timestamp (ISO 8601) เพื่อให้แสดงกราฟแนวเวลาได้
* รองรับการเรียกดูย้อนหลังแบบรายวินาที รายชั่วโมง รายวัน

**GET /api/sensors/history**
```json
{
  "period": "1h",
  "interval": "5m",
  "data": {
    "temperature_history": [
      { "time": "2025-06-11T14:00:00Z", "value": 25.2 },
      { "time": "2025-06-11T14:05:00Z", "value": 25.5 },
      { "time": "2025-06-11T14:10:00Z", "value": 25.8 }
    ],
    "humidity_history": [
      { "time": "2025-06-11T14:00:00Z", "value": 60.1 },
      { "time": "2025-06-11T14:05:00Z", "value": 59.8 },
      { "time": "2025-06-11T14:10:00Z", "value": 60.3 }
    ],
    "weight_history": [
      { "time": "2025-06-11T14:00:00Z", "value": 1384.2 },
      { "time": "2025-06-11T14:05:00Z", "value": 1380.1 },
      { "time": "2025-06-11T14:10:00Z", "value": 1378.5 }
    ]
  }
}
```

**Query Parameters:**
- `period`: 1h, 6h, 24h, 7d
- `interval`: 1m, 5m, 1h
- `sensors`: comma-separated list of sensor names

### 9. **Firebase Integration**

**POST /api/firebase/sync**
```json
{
  "action": "sync_all",
  "data_types": ["sensors", "logs", "commands"],
  "force": false
}
```

**GET /api/firebase/status**
```json
{
  "connected": true,
  "last_sync": "2025-06-11T14:00:00Z",
  "sync_status": "success",
  "pending_records": 0
}
```

## 📎 หมายเหตุเพิ่มเติม

* **ห้ามลบ feature เดิม** ที่ยังใช้งานได้
* หาก serial disconnect → ให้ retry โดยไม่ crash
* ให้แยก Log Sensor, Command, Error อย่างชัดเจน
* ถ้าไม่มี Firebase → ไม่ต้องหยุดระบบ ให้ทำงานแบบ offline ต่อ
* **Error Handling**: ทุก API ต้องมี try-catch และส่ง error response ที่ชัดเจน
* **Rate Limiting**: จำกัดการเรียก API ไม่เกิน 10 requests/second
* **Logging**: บันทึก access log สำหรับ debug

## 🔧 Arduino Serial Protocol

### Commands to Arduino:
```
U:X.X          - Actuator Up (seconds)
D:X.X          - Actuator Down (seconds)  
G:0/1/2        - Auger Control (0=stop, 1=forward, 2=reverse)
B:0/1          - Blower Control (0=off, 1=on)
R:0/1/2        - Relay Control (0=all off, 1=relay1, 2=relay2)
SPD:XXX        - Set PWM Speed (0-255)
S:ALL          - Request all sensor data
```

### Expected Arduino Responses:
```
OK             - Command executed successfully
ERROR:message  - Error occurred
SENSOR:json    - Sensor data response
READY          - Arduino ready for commands
```

---

## ✅ หลังจากอัปเดตแล้ว ให้ตรวจสอบว่า Web App สามารถ:

* อ่าน sensor data ได้แบบ real-time
* ควบคุมอุปกรณ์ (motor, blower, relay) ได้ทันที
* ตั้งเวลาอุปกรณ์ feed ได้ผ่านหน้าเว็บ แล้วสั่ง Arduino ตาม logic
* ใช้งานฟีเจอร์ Cooling Fan Auto Mode ได้แบบ live UI
* แสดงผลข้อมูล sensor เป็นกราฟแบบ timeline ได้ในหน้า Dashboard หรือ Temperature Control

**📌 หากต้องการ debug เพิ่มเติม**: ดูจาก `README.md` ฝั่ง `fish-feeder-web` ที่ path ที่กำหนด

---

**📁 Instruction updated by Web App Control Team – 2025-06-11**  
**🎯 Project Code: B65IEE02**  
**🏫 Suranaree University of Technology - Industrial Electrical Engineering** 