# 🔧 Pi Server Implementation Guide - Automatic Fan Control

## 📋 Overview

เว็บฝั่ง **Fan & Temperature Control** ได้เพิ่มระบบควบคุมพัดลมอัตโนมัติแล้ว ทีม Pi Server ต้องทำการปรับปรุงดังนี้:

**🔗 เว็บไซต์**: [https://fish-feeder-test-1.web.app/fan-temp-control](https://fish-feeder-test-1.web.app/fan-temp-control)

---

## 🎯 **ฟีเจอร์ที่เพิ่มมา**

### 1. **🌡️ DHT22 Sensor Integration (PIN 48)**
- อ่านอุณหภูมิจากเซ็นเซอร์ DHT22 ที่ตำแหน่ง PIN 48 (Control Box)
- ใช้เป็นข้อมูลหลักในการควบคุมพัดลมอัตโนมัติ

### 2. **🔌 Relay Control (PIN 52)**
- ควบคุมพัดลมผ่าน Relay IN1 ที่ PIN 52
- คำสั่ง: `R:2` = เปิดพัดลม, `R:0` = ปิดพัดลม

### 3. **🔥 Firebase Integration**
- บันทึกการตั้งค่าลง Firebase Realtime Database
- Sync แบบ real-time ระหว่าง Web ↔ Pi Server ↔ Arduino

### 4. **⚙️ Auto Control Logic**
- **Threshold Control**: เปิดพัดลมเมื่ออุณหภูมิ ≥ threshold
- **Hysteresis**: ปิดพัดลมเมื่ออุณหภูมิ ≤ (threshold - hysteresis)
- **Default Settings**: Threshold = 40°C, Speed = 255, Hysteresis = 2°C

---

## 🔥 **Firebase Database Structure**

ระบบใหม่ใช้ Firebase paths ต่อไปนี้:

```json
{
  "fish_feeder": {
    "fan_control": {
      "settings": {
        "temperatureThreshold": 40,
        "fanSpeed": 255,
        "autoMode": true,
        "hysteresis": 2,
        "lastUpdated": "2024-12-07T10:30:00Z"
      },
      "current_temperature": {
        "systemTemp": 35.2,
        "feederTemp": 28.5,
        "timestamp": "2024-12-07T10:30:00Z"
      },
      "status": {
        "fanStatus": true,
        "command": "R:2",
        "timestamp": "2024-12-07T10:30:00Z",
        "temperature": 41.5,
        "threshold": 40
      }
    }
  }
}
```

---

## 🐍 **Python Implementation Example**

### **Required Libraries:**
```bash
pip install firebase-admin pyserial
```

### **Firebase Setup:**
```python
import firebase_admin
from firebase_admin import credentials, db
import serial
import time
import json
from datetime import datetime

# Initialize Firebase
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fish-feeder-test-1-default-rtdb.asia-southeast1.firebasedatabase.app'
})

# Arduino Serial Connection
arduino = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
```

### **Main Auto Control Logic:**
```python
class AutoFanController:
    def __init__(self):
        self.last_fan_status = False
        self.current_settings = {
            'temperatureThreshold': 40,
            'fanSpeed': 255,
            'autoMode': True,
            'hysteresis': 2
        }
        
    def load_settings_from_firebase(self):
        """โหลดการตั้งค่าจาก Firebase"""
        try:
            ref = db.reference('fish_feeder/fan_control/settings')
            settings = ref.get()
            if settings:
                self.current_settings.update(settings)
                print(f"✅ Settings loaded: {self.current_settings}")
            else:
                # Save default settings if none exist
                self.save_default_settings()
        except Exception as e:
            print(f"❌ Firebase load error: {e}")
            
    def save_default_settings(self):
        """บันทึกการตั้งค่าเริ่มต้น"""
        try:
            ref = db.reference('fish_feeder/fan_control/settings')
            ref.set(self.current_settings)
            print("✅ Default settings saved to Firebase")
        except Exception as e:
            print(f"❌ Firebase save error: {e}")
            
    def read_dht22_temperature(self):
        """อ่านอุณหภูมิจาก DHT22 PIN 48"""
        try:
            # Send sensor reading command to Arduino
            arduino.write(b"S:ALL\n")
            time.sleep(0.1)
            
            response = arduino.readline().decode().strip()
            if response.startswith("SENSORS:"):
                # Parse JSON response from Arduino
                sensor_data = json.loads(response[8:])  # Remove "SENSORS:" prefix
                
                # Extract system temperature
                system_temp = sensor_data.get('temperature', 25.0)
                return float(system_temp)
                
        except Exception as e:
            print(f"❌ DHT22 read error: {e}")
            return 25.0  # Default fallback temperature
            
    def control_fan_relay(self, turn_on: bool):
        """ควบคุม Relay IN1 (PIN 52)"""
        try:
            command = "R:2" if turn_on else "R:0"
            arduino.write(f"{command}\n".encode())
            time.sleep(0.1)
            
            response = arduino.readline().decode().strip()
            print(f"🔌 Relay command {command}: {response}")
            
            # Update Firebase status
            self.update_firebase_status(turn_on, command)
            
            return True
        except Exception as e:
            print(f"❌ Relay control error: {e}")
            return False
            
    def update_firebase_status(self, fan_status: bool, command: str):
        """อัปเดตสถานะไป Firebase"""
        try:
            status_ref = db.reference('fish_feeder/fan_control/status')
            status_ref.set({
                'fanStatus': fan_status,
                'command': command,
                'timestamp': datetime.utcnow().isoformat(),
                'temperature': self.current_temperature,
                'threshold': self.current_settings['temperatureThreshold']
            })
        except Exception as e:
            print(f"❌ Firebase status update error: {e}")
            
    def auto_control_logic(self, current_temp: float):
        """Main Auto Control Logic"""
        if not self.current_settings['autoMode']:
            return  # Skip if manual mode
            
        threshold = self.current_settings['temperatureThreshold']
        hysteresis = self.current_settings['hysteresis']
        
        should_turn_on = current_temp >= threshold
        should_turn_off = current_temp <= (threshold - hysteresis)
        
        # Fan ON logic
        if not self.last_fan_status and should_turn_on:
            print(f"🌡️ AUTO FAN ON: {current_temp}°C >= {threshold}°C")
            if self.control_fan_relay(True):
                self.last_fan_status = True
                
        # Fan OFF logic  
        elif self.last_fan_status and should_turn_off:
            print(f"❄️ AUTO FAN OFF: {current_temp}°C <= {threshold - hysteresis}°C")
            if self.control_fan_relay(False):
                self.last_fan_status = False
                
    def update_temperature_to_firebase(self, system_temp: float):
        """อัปเดตอุณหภูมิปัจจุบันไป Firebase"""
        try:
            temp_ref = db.reference('fish_feeder/fan_control/current_temperature')
            temp_ref.set({
                'systemTemp': system_temp,
                'feederTemp': 0,  # Add DHT22_FEEDER if available
                'timestamp': datetime.utcnow().isoformat()
            })
        except Exception as e:
            print(f"❌ Temperature update error: {e}")
            
    def run_main_loop(self):
        """Main Control Loop"""
        print("🚀 Starting Auto Fan Controller...")
        
        while True:
            try:
                # 1. Load latest settings from Firebase
                self.load_settings_from_firebase()
                
                # 2. Read temperature from DHT22 PIN 48
                self.current_temperature = self.read_dht22_temperature()
                print(f"🌡️ Current Temperature: {self.current_temperature}°C")
                
                # 3. Update temperature to Firebase
                self.update_temperature_to_firebase(self.current_temperature)
                
                # 4. Execute auto control logic
                self.auto_control_logic(self.current_temperature)
                
                # 5. Wait 5 seconds before next check
                time.sleep(5)
                
            except KeyboardInterrupt:
                print("\n⏹️ Auto Fan Controller stopped")
                break
            except Exception as e:
                print(f"❌ Main loop error: {e}")
                time.sleep(5)

# Run the controller
if __name__ == "__main__":
    controller = AutoFanController()
    controller.run_main_loop()
```

---

## 🔌 **API Endpoints ที่ต้องเพิ่ม**

### **1. Direct Control (อัปเดตให้รองรับ R:2/R:0)**
```python
@app.route('/api/control/direct', methods=['POST'])
def direct_control():
    try:
        data = request.get_json()
        command = data.get('command')
        
        # Support relay commands
        if command in ['R:0', 'R:1', 'R:2']:
            arduino.write(f"{command}\n".encode())
            response = arduino.readline().decode().strip()
            
            return jsonify({
                "status": "success",
                "message": f"Relay command {command} executed",
                "arduino_response": response
            })
            
        # Other commands...
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
```

### **2. Fan Control Status**
```python
@app.route('/api/fan/status', methods=['GET'])
def get_fan_status():
    try:
        # Read from Firebase or Arduino
        status_ref = db.reference('fish_feeder/fan_control/status')
        status = status_ref.get()
        
        return jsonify({
            "status": "success",
            "data": status or {"fanStatus": False, "command": "R:0"}
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
```

---

## 🤖 **Arduino Requirements**

### **Serial Commands ที่ต้องรองรับ:**

```cpp
// Relay Control Commands
if (cmd == "R:0") {  // All Relays OFF
    digitalWrite(RELAY_1_PIN, LOW);  // PIN 52
    digitalWrite(RELAY_2_PIN, LOW);
    Serial.println("OK:R:0:ALL_OFF");
}
else if (cmd == "R:1") {  // Relay 1 ON (LED)
    digitalWrite(RELAY_1_PIN, HIGH);
    Serial.println("OK:R:1:LED_ON");
}
else if (cmd == "R:2") {  // Relay 2 ON (Fan) - PIN 52
    digitalWrite(RELAY_2_PIN, HIGH);  // Fan Relay
    Serial.println("OK:R:2:FAN_ON");
}

// DHT22 Sensor Reading (PIN 48)
else if (cmd == "S:ALL") {
    float temp = dht_system.readTemperature();  // DHT22 PIN 48
    float humidity = dht_system.readHumidity();
    
    String json = "{";
    json += "\"temperature\":" + String(temp) + ",";
    json += "\"humidity\":" + String(humidity) + ",";
    json += "\"timestamp\":\"" + String(millis()) + "\"";
    json += "}";
    
    Serial.println("SENSORS:" + json);
}
```

### **Hardware Pinout:**
```cpp
// DHT22 Sensors
#define DHT22_SYSTEM_PIN    48  // Control box temperature
#define DHT22_FEEDER_PIN    47  // Feed bucket temperature

// Relay Controls  
#define RELAY_1_PIN         51  // LED/Light control
#define RELAY_2_PIN         52  // Fan control (IMPORTANT!)

// Other sensors...
#define HX711_DOUT_PIN      3
#define HX711_SCK_PIN       2
```

---

## ⚡ **Testing & Validation**

### **1. Firebase Testing:**
```bash
# Test Firebase connection
curl -X GET "https://fish-feeder-test-1-default-rtdb.asia-southeast1.firebasedatabase.app/fish_feeder/fan_control/settings.json"

# Update settings
curl -X PUT "https://fish-feeder-test-1-default-rtdb.asia-southeast1.firebasedatabase.app/fish_feeder/fan_control/settings.json" \
  -d '{"temperatureThreshold": 35, "fanSpeed": 255, "autoMode": true, "hysteresis": 2}'
```

### **2. Arduino Serial Testing:**
```cpp
// Test commands in Arduino IDE Serial Monitor:
R:0        // Should respond: OK:R:0:ALL_OFF
R:2        // Should respond: OK:R:2:FAN_ON
S:ALL      // Should respond: SENSORS:{...temperature...}
```

### **3. Pi Server Testing:**
```bash
# Test direct control
curl -X POST http://pi-ip:5000/api/control/direct \
  -H "Content-Type: application/json" \
  -d '{"command": "R:2"}'

# Test fan status
curl -X GET http://pi-ip:5000/api/fan/status
```

---

## 🚨 **Critical Implementation Notes**

1. **⚠️ Hardware Safety**: 
   - ต้องใช้ Relay เพื่อควบคุมพัดลม ห้ามต่อตรงกับ Arduino
   - ตรวจสอบ Voltage และ Current rating ของ Relay

2. **🔧 DHT22 Wiring**:
   - VCC → 3.3V หรือ 5V
   - GND → Ground  
   - DATA → PIN 48 (พร้อม Pull-up resistor 10kΩ)

3. **🔥 Firebase Permissions**:
   - Database Rules ต้องอนุญาต read/write
   - ใช้ Service Account Key สำหรับ Pi Server

4. **⏱️ Timing Considerations**:
   - Hysteresis ป้องกันการเปิด/ปิดถี่
   - Update interval = 5 วินาที (สามารถปรับได้)
   - Web sync real-time via Firebase

---

## 📞 **Support & Troubleshooting**

หากมีปัญหาการทำงาน:

1. **ตรวจสอบ Serial Communication**: Arduino ↔ Pi
2. **ตรวจสอบ Firebase Connection**: Pi ↔ Firebase  
3. **ตรวจสอบ Hardware**: DHT22, Relay, Wiring
4. **ดู Log Messages**: ทั้งใน Pi และ Arduino Serial Monitor

**📧 Contact**: ติดต่อทีมพัฒนาเว็บผ่าน GitHub Issues

---

**🚀 Ready to implement!** เว็บพร้อมใช้งานแล้วที่ [https://fish-feeder-test-1.web.app/fan-temp-control](https://fish-feeder-test-1.web.app/fan-temp-control) 