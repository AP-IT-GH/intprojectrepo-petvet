#include "BluetoothSerial.h"
/*
// Check if Bluetooth configs are enabled
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif
*/
// Bluetooth Serial object
BluetoothSerial SerialBT;

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
char dataString [25];
String receivedString;

// Handle received and sent messages
String message = "";
char incomingChar;

void setup() {
  Serial.begin(115200);
  // Bluetooth device name
  if(!SerialBT.begin("PetVet"))
  {
    Serial.println("An error occurred initializing Bluetooth");
  }
  else
  {
    Serial.println("Bluetooth initialized");
  }
  
  delay(1000);
}

void loop() {
  // Read received messages
  if (SerialBT.available()){
    char incomingChar = SerialBT.read();
    if (incomingChar != '\n'){
      message += String(incomingChar);
    }
    else{
      message.clear();
    }  
      Serial.write(incomingChar);
  }
  // Check received message and control output accordingly
  if (message == "1"){
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

        Serial.println("");
        Serial.print(leftFront);
        Serial.print(" , ");
        Serial.print(rightFront);
        Serial.print(" , ");
        Serial.print(leftBack);
        Serial.print(" , ");
        Serial.println(rightBack);

        sprintf (dataString, "%.2f%.2f%.2f%.2f%.1f", leftFront, rightFront, leftBack, rightBack, temperature);
        SerialBT.println(dataString);
        lfVoltageSum = 0;
        rfVoltageSum = 0;
        lbVoltageSum = 0;
        rbVoltageSum = 0;
        message.clear();
  }
  delay(100);
}
