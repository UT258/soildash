# DEVICE_FIRMWARE_EXAMPLE.md

## ESP32 Firmware Example

This is a reference implementation for your ESP32 device to work with SoilDash.

### Requirements

- Arduino IDE or PlatformIO
- ESP32 board support
- WiFi connectivity

### Arduino Sketch Example

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* SSID = "YourSSID";
const char* PASSWORD = "YourPassword";

// Sensor pins
#define TEMP_SENSOR_PIN 34  // ADC
#define HUM_SENSOR_PIN 35   // ADC
#define SOIL_SENSOR_PIN 32  // ADC

// Web server on port 80
WebServer server(80);

// Sensor reading functions
float readTemperature() {
  int raw = analogRead(TEMP_SENSOR_PIN);
  // Convert ADC (0-4095) to voltage (0-3.3V)
  // Then to temperature - adjust calibration for your sensor
  float voltage = (raw / 4095.0) * 3.3;
  float temp = (voltage - 0.5) * 100.0;  // Example: LM35 sensor
  return constrain(temp, -40, 125);
}

float readHumidity() {
  int raw = analogRead(HUM_SENSOR_PIN);
  // Convert ADC to percentage (0-100%)
  // Adjust min/max ADC values for your sensor
  float humidity = (raw / 4095.0) * 100.0;
  return constrain(humidity, 0, 100);
}

float readSoilMoisture() {
  int raw = analogRead(SOIL_SENSOR_PIN);
  // Calibrate: dry soil ~4095, wet soil ~1000
  // Adjust these values for your soil sensor
  int dryValue = 4095;
  int wetValue = 1000;
  float moisture = ((dryValue - raw) / float(dryValue - wetValue)) * 100.0;
  return constrain(moisture, 0, 100);
}

// Determine device status
String getStatus(float temp, float humidity, float soil) {
  // Example thresholds - adjust for your application
  if (temp < 10 || temp > 40 || humidity < 20 || humidity > 95 || soil < 20) {
    return "DANGER";
  }
  return "SAFE";
}

// JSON endpoint
void handleData() {
  float temp = readTemperature();
  float humidity = readHumidity();
  float soil = readSoilMoisture();
  String status = getStatus(temp, humidity, soil);

  // Build JSON
  StaticJsonDocument<256> doc;
  doc["temp"] = round(temp * 10) / 10.0;  // 1 decimal place
  doc["hum"] = round(humidity * 10) / 10.0;
  doc["soil"] = round(soil * 10) / 10.0;
  doc["status"] = status;
  doc["ts"] = getISOTime();

  // Set CORS headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Content-Type", "application/json");

  // Send response
  String json;
  serializeJson(doc, json);
  server.send(200, "application/json", json);
}

// ISO8601 timestamp
String getISOTime() {
  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  return String(buffer);
}

// CORS preflight
void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Configure ADC
  analogReadResolution(12);  // 12-bit (0-4095)

  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(SSID);
  WiFi.begin(SSID, PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }

  // Set up web server
  server.on("/data", handleData);
  server.on("/data", HTTP_OPTIONS, handleOptions);
  server.on("/", []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "SoilDash ESP32 Device");
  });

  server.begin();
  Serial.println("Web server started on port 80");
}

void loop() {
  server.handleClient();
  delay(1);
}
```

### PlatformIO Setup

**platformio.ini**
```ini
[env:esp32]
platform = espressif32
board = esp32doit-devkit-v1
framework = arduino
monitor_speed = 115200
lib_deps =
    ArduinoJson@^6.20.0
    WiFi
```

### Configuration for SoilDash

1. Build and upload sketch to ESP32
2. Get ESP32's IP address from Serial output
3. Test endpoint: `curl http://<ESP32_IP>/data`
4. Configure SoilDash:
   - Device IP: Your ESP32 IP
   - Use proxy: Yes (recommended)

### Sensor Calibration

#### Temperature Sensor (LM35)
```
Vout = 0.5V @ 0°C
Vout = 0.75V @ 25°C
Vout increases 10mV per °C

Temp (°C) = (Vout - 0.5V) * 100
```

#### Humidity Sensor (DHT22)
- Connected to digital GPIO
- Alternative: Use DHT library instead of ADC

```cpp
#include <DHT.h>
#define DHTPIN 27
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

float readHumidity() {
  return dht.readHumidity();
}
```

#### Soil Moisture Sensor
- Capacitive sensor preferred (non-corroding)
- Analog output to ADC

```
Dry soil: ~3.2V (4095 ADC) → 0%
Wet soil: ~1.2V (1550 ADC) → 100%

Adjust dryValue and wetValue based on your sensor
```

### Testing

```bash
# Test HTTP endpoint
curl http://192.168.4.1/data

# Expected output:
# {"temp":23.5,"hum":65.2,"soil":78.4,"status":"SAFE","ts":"2025-12-04T10:30:45Z"}

# Test CORS preflight
curl -X OPTIONS http://192.168.4.1/data \
  -H "Origin: http://localhost:5173"
```

### Power Management

For battery operation:
```cpp
// Deep sleep after reading
esp_sleep_enable_timer_wakeup(60 * 1000000);  // 60 seconds
esp_deep_sleep_start();
```

### HTTPS Support

For production, enable HTTPS:
```cpp
#include <WiFiClientSecure.h>

// Generate self-signed certificate
// Or use Let's Encrypt with Arduino

// In handleData:
// Use WebServerSecure instead of WebServer
```

### Advanced: OTA Updates

Allow over-the-air firmware updates:
```cpp
#include <ArduinoOTA.h>

void setupOTA() {
  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();
  server.handleClient();
}
```

## Troubleshooting

### Device not visible on network
- Check WiFi credentials
- Check IP range (usually 192.168.4.x)
- Check firewall allows mDNS
- Use Serial monitor to verify connection

### Sensor readings incorrect
- Verify sensor wiring
- Check ADC voltage range (0-3.3V)
- Calibrate min/max values
- Use multimeter to verify sensor output

### Dashboard shows "DANGER"
- Adjust threshold values in Settings
- Verify sensor readings are within expected range
- Check sensor calibration

## References

- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
- [ArduinoJson](https://arduinojson.org/)
- [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)
