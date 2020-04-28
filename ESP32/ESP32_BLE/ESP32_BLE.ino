

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

char dataString [20];
String receivedString = "";

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
bool active = false;

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
      Serial.println("disconnected");

      deviceConnected = false;
    }
};
class MyCallback: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value.length() > 0) {
        for (int i = 0; i < value.length(); i++)
        {
          receivedString += value[i];
        }

        int received = receivedString.toInt();
        receivedString.clear();
        value.clear();

        if (received == 0)
          ESP.restart();

        active = received == 1;
      }
    }
};

void setup() {
  Serial.begin(115200);
  receivedString = "";
  dataString[0] = '\0';
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
                      BLECharacteristic::PROPERTY_WRITE_NR  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );
  pCharacteristic->setCallbacks(new MyCallback());

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
  //    if (deviceConnected) {
  if (active) {
    delay(100);

    // 100 measurements from each leg, with 10ms delay the measuring will last about 1 second
    for (int i = 0; i < 100; i++) {
              sensorValueLF = (analogRead(lfPin) * vInput) / 4095;
              sensorValueRF = (analogRead(rfPin) * vInput) / 4095;
              sensorValueLB = (analogRead(lbPin) * vInput) / 4095;
              sensorValueRB = (analogRead(rbPin) * vInput) / 4095;

              sensorVoltageLF[i] = vInput - sensorValueLF;
              sensorVoltageRF[i] = vInput - sensorValueRF;
              sensorVoltageLB[i] = vInput - sensorValueLB;
              sensorVoltageRB[i] = vInput - sensorValueRB;
              delay(10);
      /*
      //for testing
      sensorVoltageLF[i] = random(140, 160) / 100.0;
      sensorVoltageRF[i] = random(140, 160) / 100.0;
      sensorVoltageLB[i] = random(220, 250) / 100.0;
      sensorVoltageRB[i] = random(220, 250) / 100.0;*/
    }
    // Sum measurements between 30-70
    lfVoltageSum = 0.0;
    rfVoltageSum = 0.0;
    lbVoltageSum = 0.0;
    rbVoltageSum = 0.0;
    for (int k = 30; k < 70; k++) {
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
    leftFront = (-444.67 * pow(lfVoltageAvg, 4) + 4066.1 * pow(lfVoltageAvg, 3) - 13303 * pow(lfVoltageAvg, 2) + 17458 * lfVoltageAvg - 6327.5) / 1000.0;
    rightFront = (-444.67 * pow(rfVoltageAvg, 4) + 4066.1 * pow(rfVoltageAvg, 3) - 13303 * pow(rfVoltageAvg, 2) + 17458 * rfVoltageAvg - 6327.5) / 1000.0;
    leftBack = (-444.67 * pow(lbVoltageAvg, 4) + 4066.1 * pow(lbVoltageAvg, 3) - 13303 * pow(lbVoltageAvg, 2) + 17458 * lbVoltageAvg - 6327.5) / 1000.0;
    rightBack = (-444.67 * pow(rbVoltageAvg, 4) + 4066.1 * pow(rbVoltageAvg, 3) - 13303 * pow(rbVoltageAvg, 2) + 17458 * rbVoltageAvg - 6327.5) / 1000.0;
    temperature = random(3500, 3800) / 100.0;

    Serial.print(leftFront);
    Serial.print(" , ");
    Serial.print(rightFront);
    Serial.print(" , ");
    Serial.print(leftBack);
    Serial.print(" , ");
    Serial.println(rightBack);

    //sprintf(dataString, "%.2f%.2f%.2f%.2f%.2f", leftFront, rightFront, leftBack, rightBack, temperature);
    to_s(dataString, 'L', leftFront);
    Serial.println(dataString);
    pCharacteristic->setValue(dataString);
    pCharacteristic->notify();

    to_s(dataString, 'R', rightFront);
    Serial.println(dataString);
    pCharacteristic->setValue(dataString);
    pCharacteristic->notify();

    to_s(dataString, 'l', leftBack);
    Serial.println(dataString);
    pCharacteristic->setValue(dataString);
    pCharacteristic->notify();

    to_s(dataString, 'r', rightBack);
    Serial.println(dataString);
    pCharacteristic->setValue(dataString);
    pCharacteristic->notify();

    to_s(dataString, 'T', temperature);
    Serial.println(dataString);
    pCharacteristic->setValue(dataString);
    pCharacteristic->notify();

    active = false;
    delay(500);

    //    }
  }
  // disconnecting
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // give the bluetooth stack the chance to get things ready
    oldDeviceConnected = deviceConnected;
    Serial.println("disconnected");

  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {
    // do stuff here on connecting
    Serial.println("connected");
    oldDeviceConnected = deviceConnected;
  }
}
void to_s(char* buffer, char type, float f) {
  sprintf(buffer, "%c%.2f", type, f);
}
