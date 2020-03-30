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

float leftFront;
float rightFront;
float leftBack;
float rightBack;
float temperature;
float vInput = 3.3; //V
int resistor = 330; //Ohm

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
        delay(100);
/*
// 100 measurements from each leg
    for(int i = 0; i < 100; i++){
        sensorValueLF = (analogRead(lfPin) * vInput) / 4095;
        sensorValueRF = (analogRead(rfPin) * vInput) / 4095;
        sensorValueLB = (analogRead(lbPin) * vInput) / 4095;
        sensorValueRB = (analogRead(rbPin) * vInput) / 4095;

        sensorVoltageLF[i] = vInput - sensorValueLF;
        sensorVoltageRF[i] = vInput - sensorValueRF;
        sensorVoltageLB[i] = vInput - sensorValueLB;
        sensorVoltageRB[i] = vInput - sensorValueRB;
        }
// Sum measurements between 30-70
    for int k = 30; k < 70; k++){
        float lfVoltageSum += sensorVoltageLF[k];
        float rfVoltageSum += sensorVoltageRF[k];
        float lbVoltageSum += sensorVoltageLB[k];
        float rbVoltageSum += sensorVoltageRB[k];
        }
// Calculating average voltage of the measurements
        float lfVoltageAvg = lfVoltageSum / 40;
        float rfVoltageAvg = rfVoltageSum / 40;
        float lbVoltageAvg = lbVoltageSum / 40;
        float rbVoltageAvg = rbVoltageSum / 40;

// Converting measured average voltages to kg, temperature is just a random number between 35-38
        leftFront = ((-2 * pow(10,-13)) * pow(lfVoltageAvg, 4) + (1 * pow(10,-10)) * pow(lfVoltageAvg, 3) + (1 * pow(10,-6)) * pow(lfVoltageAvg, 2) - 0.0022 * lfVoltageAvg + 3.1642) / 1000;
        rightFront = ((-2 * pow(10,-13)) * pow(rfVoltageAvg, 4) + (1 * pow(10,-10)) * pow(rfVoltageAvg, 3) + (1 * pow(10,-6)) * pow(rfVoltageAvg, 2) - 0.0022 * rfVoltageAvg + 3.1642) / 1000;
        leftBack = ((-2 * pow(10,-13)) * pow(lbVoltageAvg, 4) + (1 * pow(10,-10)) * pow(lbVoltageAvg, 3) + (1 * pow(10,-6)) * pow(lbVoltageAvg, 2) - 0.0022 * lbVoltageAvg + 3.1642) / 1000;
        rightBack = ((-2 * pow(10,-13)) * pow(rbVoltageAvg, 4) + (1 * pow(10,-10)) * pow(rbVoltageAvg, 3) + (1 * pow(10,-6)) * pow(rbVoltageAvg, 2) - 0.0022 * rbVoltageAvg + 3.1642) / 1000;
        temperature = random(3500, 3800) / 100;
*/
        leftFront = 1.5;
        rightFront = 1.5;
        leftBack = 0.5;
        rightBack = 0.5;
        temperature = random(3500, 3800) / 100;

        void* pkt = malloc(20);
        memcpy(pkt,&leftFront,4);
        memcpy(pkt+4,&rightFront,4);
        memcpy(pkt+8,&leftBack,4);
        memcpy(pkt+12,&rightBack,4);
        memcpy(pkt+16,&temperature,4);

        pCharacteristic->setValue((uint8_t*)pkt,20);
        pCharacteristic->notify();
        delay(100); // bluetooth stack will go into congestion, if too many packets are sent, in 6 hours test i was able to go as low as 3ms
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
