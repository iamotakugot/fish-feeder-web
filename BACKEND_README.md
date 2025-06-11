# Fish Feeder Backend Implementation Guide

## 📋 Overview
This document outlines the backend API requirements and Arduino/Pi server implementation needed for the Fish Feeder Web Application.

## 🌐 Web Application
- **Live Demo**: https://fish-feeder-test-1.web.app
- **GitHub**: https://github.com/iamotakugot/fish-feeder-web
- **Frontend**: React 18.3.1 + TypeScript + Vite + HeroUI + Tailwind CSS

## 🔌 Required API Endpoints

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "serial_connected": true,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 2. Sensor Data (Weight)
```http
GET /api/sensors/{sensor_name}
```
**Parameters:**
- `sensor_name`: `HX711_FEEDER`

**Response:**
```json
{
  "sensor_name": "HX711_FEEDER",
  "values": [
    {
      "type": "weight",
      "value": 1250.5,
      "unit": "grams",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 3. Feed Control (CRITICAL)
```http
POST /api/feed
```
**Request Body:**
```json
{
  "action": "small|medium|large|xl|custom",
  "amount": 100,  // Only required for custom action
  "actuator_up": 3,     // seconds - actuator up duration
  "actuator_down": 2,   // seconds - actuator down duration  
  "auger_duration": 20, // seconds - auger run duration then auto-stop
  "blower_duration": 15 // seconds - blower run duration then auto-stop
}
```

**Preset Values (from Web UI):**
- `small`: User-configurable (default: 50g)
- `medium`: User-configurable (default: 100g) 
- `large`: User-configurable (default: 200g)
- `xl`: User-configurable (default: 1000g = 1kg)

**Response:**
```json
{
  "success": true,
  "message": "Feed command executed successfully",
  "feed_id": "feed_20240101_120000",
  "estimated_duration": 45,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 4. Feed History
```http
GET /api/feed/history
```
**Response:**
```json
{
  "data": [
    {
      "feed_id": "feed_20240101_120000",
      "timestamp": "2024-01-01T12:00:00Z",
      "amount": 100,
      "type": "manual|scheduled",
      "status": "completed|failed|in_progress",
      "video_url": "https://drive.google.com/file/d/abc123/view", // NEW REQUIREMENT
      "duration_seconds": 45,
      "device_timings": {
        "actuator_up": 3,
        "actuator_down": 2,
        "auger_duration": 20,
        "blower_duration": 15
      }
    }
  ]
}
```

### 5. Feed Statistics
```http
GET /api/feed/statistics
```
**Response:**
```json
{
  "total_amount_today": 450,
  "total_feeds_today": 4,
  "average_per_feed": 112.5,
  "last_feed_time": "2024-01-01T12:00:00Z",
  "daily_target": 500,
  "target_achieved_percentage": 90
}
```

### 6. Camera Controls
```http
POST /api/camera/photo
```
**Response:**
```json
{
  "success": true,
  "photo_url": "https://drive.google.com/file/d/xyz789/view",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🤖 Arduino Implementation Requirements

### Hardware Control Sequence
1. **Actuator Up**: Lift the feeding mechanism (duration: `actuator_up` seconds)
2. **Auger Operation**: Rotate auger to dispense food (duration: `auger_duration` seconds, then auto-stop)
3. **Actuator Down**: Lower the feeding mechanism (duration: `actuator_down` seconds)  
4. **Blower Operation**: Activate blower to distribute food (duration: `blower_duration` seconds, then auto-stop)

### Device Timing Controls
The web UI allows users to configure:
- **Actuator Up (s)**: 1-30 seconds (default: 3)
- **Actuator Down (s)**: 1-30 seconds (default: 2)
- **Auger Duration (s)**: 1-60 seconds (default: 20) - **AUTO-STOP after duration**
- **Blower Duration (s)**: 1-60 seconds (default: 15) - **AUTO-STOP after duration**

### Serial Communication Protocol
```cpp
// Arduino should expect commands like:
// FEED,100,3,2,20,15
// Where: amount,actuator_up,actuator_down,auger_duration,blower_duration

void handleFeedCommand(int amount, int actuator_up, int actuator_down, 
                      int auger_duration, int blower_duration) {
  // 1. Move actuator up
  moveActuatorUp();
  delay(actuator_up * 1000);
  
  // 2. Run auger for specified duration
  startAuger();
  delay(auger_duration * 1000);
  stopAuger(); // AUTO-STOP after duration
  
  // 3. Move actuator down  
  moveActuatorDown();
  delay(actuator_down * 1000);
  
  // 4. Run blower for specified duration
  startBlower();
  delay(blower_duration * 1000);
  stopBlower(); // AUTO-STOP after duration
  
  // 5. Send completion response
  Serial.println("FEED_COMPLETE");
}
```

## 🎥 Video Recording Integration

### Required: Feed Session Recording
- **Trigger**: Automatically start recording when feed command is executed
- **Duration**: Record the entire feeding process (all 4 steps above)
- **Storage**: Upload to Google Drive or accessible cloud storage
- **URL**: Return `video_url` in feed history API response

### Camera Stream (Optional)
- **Live Stream**: `rtsp://pi-server:8554/stream` or `http://pi-server:8080/stream`
- **Web UI Integration**: Embedded video player for live monitoring

## 🔧 Pi Server Implementation Notes

### Flask/FastAPI Server Structure
```python
from flask import Flask, request, jsonify
import serial
import time

app = Flask(__name__)
arduino = serial.Serial('/dev/ttyUSB0', 9600)

@app.route('/api/feed', methods=['POST'])
def feed_fish():
    data = request.json
    
    # Extract timing parameters
    amount = data.get('amount', 100)
    actuator_up = data.get('actuator_up', 3)
    actuator_down = data.get('actuator_down', 2) 
    auger_duration = data.get('auger_duration', 20)
    blower_duration = data.get('blower_duration', 15)
    
    # Start video recording
    video_url = start_feed_recording()
    
    # Send command to Arduino
    command = f"FEED,{amount},{actuator_up},{actuator_down},{auger_duration},{blower_duration}\n"
    arduino.write(command.encode())
    
    # Wait for completion
    response = arduino.readline().decode().strip()
    
    # Stop recording and get URL
    video_url = stop_feed_recording()
    
    # Save to feed history with video URL
    save_feed_history(amount, "manual", video_url, {
        'actuator_up': actuator_up,
        'actuator_down': actuator_down,
        'auger_duration': auger_duration,
        'blower_duration': blower_duration
    })
    
    return jsonify({
        'success': True,
        'message': 'Feed completed',
        'video_url': video_url
    })
```

### Critical Implementation Points

1. **Device Auto-Stop**: Auger and blower must automatically stop after their duration expires
2. **Video Integration**: Each feed session should have a recorded video URL
3. **Timing Persistence**: User's timing preferences are saved in browser localStorage
4. **Error Handling**: Robust error handling for Arduino communication failures
5. **Weight Monitoring**: Continuous HX711 weight sensor readings during feeding

## 📱 Expected User Workflow

1. **Configure Timing**: User sets device timing once (auto-saved in browser)
2. **Live Monitoring**: User watches live camera feed
3. **Manual Feed**: User selects amount (small/medium/large/1kg or custom)
4. **Automatic Execution**: System executes 4-step feeding process with user's timing
5. **Video Review**: User can watch recorded video of feeding session
6. **History Tracking**: All feeds logged with video URLs and timing data

## 🚀 Quick Start for Developers

1. **Set up Pi Server** with Flask/FastAPI
2. **Connect Arduino** via USB/Serial
3. **Implement feed control** with timing parameters
4. **Add video recording** using Pi Camera/USB camera
5. **Test API endpoints** with the web application
6. **Deploy and configure** CORS for web app domain

## 📧 Support
For questions about the web application integration, contact the frontend development team or check the GitHub repository issues. 