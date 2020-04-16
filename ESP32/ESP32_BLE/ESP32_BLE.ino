#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

const int lfPin = 34; //Left forward leg
const int rfPin = 35; //Right Forward leg
const int lbPin = 32; //Left back leg
const int rbPin = 33; //Right back leg

float sensorValueLF;
float sensorValueRF;
float sensorValueLB;
float sensorValueRB;

float sensorVoltageLF[100];
float sensorVoltageRF[100];
float sensorVoltageLB[100];
float sensorVoltageRB[100];
float lfVoltageSum;
float rfVoltageSum;
float lbVoltageSum;
float rbVoltageSum;

float leftFront;
float rightFront;
float leftBack;
float rightBack;
float temperature;
float vInput = 3.3; //V
int resistor = 330; //Ohm

char dataString [40];
String receivedString;

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "000000ff-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "0000ff01-36e1-4688-b7f5-ea07361b26a8"


class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      BLEDevice::startAdvertising();
      delay(1000);
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

void setup() {
  Serial.begin(115200);

  // Create the BLE Device
  BLEDevice::init("PetVet");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE  
                    );

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection to notify...");
  delay(100);
}

void loop() {
    // notify changed value    
    if (deviceConnected) {
    
    std::string value = pCharacteristic->getValue();
    
    if(value.length() > 0){
      for (int i = 0; i < value.length(); i++)
      {
        receivedString += value[i];
        Serial.println(value[i]);
      }
      
    int received = receivedString.toInt();
    delay(100);
    receivedString.clear();
    if(received == 1){
    delay(100);

// 100 measurements from each leg, with 10ms delay the measuring will last about 1 second
    for(int i = 0; i < 100; i++){  
      /*      
        sensorValueLF = (analogRead(lfPin) * vInput) / 4095;
        sensorValueRF = (analogRead(rfPin) * vInput) / 4095;
        sensorValueLB = (analogRead(lbPin) * vInput) / 4095;
        sensorValueRB = (analogRead(rbPin) * vInput) / 4095;

        sensorVoltageLF[i] = vInput - sensorValueLF;
        sensorVoltageRF[i] = vInput - sensorValueRF;
        sensorVoltageLB[i] = vInput - sensorValueLB;
        sensorVoltageRB[i] = vInput - sensorValueRB;
        delay(10);       
      */
        
        //generating "voltage" for testing
        sensorVoltageLF[i] = random(17, 20) / 100.0;  //about 960-1160g
        sensorVoltageRF[i] = random(43, 53) / 100.0;  //about 960-1160g
        sensorVoltageLB[i] = random(30, 37) / 100.0;  //about 570-780g
        sensorVoltageRB[i] = random(37, 47) / 100.0;  //about 570-780g
        
        }
// Sum measurements between 30-70
    for (int k = 30; k < 70; k++){
        lfVoltageSum += sensorVoltageLF[k];
        rfVoltageSum += sensorVoltageRF[k];
        lbVoltageSum += sensorVoltageLB[k];
        rbVoltageSum += sensorVoltageRB[k];
        }
// Calculating average voltage of the measurements
        float lfVoltageAvg = lfVoltageSum / 40.0;
        float rfVoltageAvg = rfVoltageSum / 40.0;
        float lbVoltageAvg = lbVoltageSum / 40.0;
        float rbVoltageAvg = rbVoltageSum / 40.0;

// Converting measured average voltages to kg, temperature is just a random number between 35-38
        leftFront = (3786.5 * pow(lfVoltageAvg, 2) - 5383.6 * lfVoltageAvg + 1925.7) / 1000.0;
        rightFront = (1057.7 * pow(rfVoltageAvg, 2) - 3230.4 * rfVoltageAvg + 2381.8) / 1000.0;
        leftBack = (1832.9 * pow(lbVoltageAvg, 2) - 3493.3 * lbVoltageAvg + 1657.1) / 1000.0;
        rightBack = (1124.4 * pow(rbVoltageAvg, 2) - 2699.0 * rbVoltageAvg + 1546.7) / 1000.0;
        temperature = random(3500, 3800) / 100.0;

        Serial.print(leftFront);
        Serial.print(" , ");
        Serial.print(rightFront);
        Serial.print(" , ");
        Serial.print(leftBack);
        Serial.print(" , ");
        Serial.println(rightBack);

        sprintf (dataString, "%.2f%.2f%.2f%.2f%.1f", leftFront, rightFront, leftBack, rightBack, temperature);
        Serial.println(dataString);
        pCharacteristic->setValue(dataString);
        pCharacteristic->notify();
        delay(100);
        lfVoltageSum = 0;
        rfVoltageSum = 0;
        lbVoltageSum = 0;
        rbVoltageSum = 0;
        receivedString.clear();
        received = 0;
        value.clear();
        pCharacteristic->setValue(value);
        delay(500); // bluetooth stack will go into congestion, if too many packets are sent, in 6 hours test i was able to go as low as 3ms
//        ESP.restart();
    }
    }
    }
    // disconnecting
    if (!deviceConnected && oldDeviceConnected) {
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.println("start advertising");
        oldDeviceConnected = deviceConnected;
    }
    // connecting
    if (deviceConnected && !oldDeviceConnected) {
        // do stuff here on connecting
        oldDeviceConnected = deviceConnected;
    }
}
