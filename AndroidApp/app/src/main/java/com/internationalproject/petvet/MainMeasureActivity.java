package com.internationalproject.petvet;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import android.Manifest;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.wifi.aware.Characteristics;
import android.os.Bundle;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.os.ParcelUuid;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class MainMeasureActivity extends AppCompatActivity {

    BluetoothManager btManager;
    BluetoothAdapter btAdapter;
    BluetoothLeScanner btScanner;
    ScanSettings settings;
    BluetoothDevice device = null;
    BluetoothGatt mgatt = null;
    String fo;
    Button saveBtn;
    String lf, rf, lb, rb, temp;
    TextView leftF,leftB,rightF,rightB,avg,temperature, connectTxt;


    private Map<String, String> mScanResults =new HashMap<>();

    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_measure_main);

        getSupportActionBar().hide();
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
        btManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        btAdapter = btManager.getAdapter();
        btScanner = btAdapter.getBluetoothLeScanner();
        leftF = findViewById(R.id.LeftFront);
        leftB = findViewById(R.id.LeftBack);
        rightF = findViewById(R.id.RightFront);
        rightB = findViewById(R.id.RightBack);
        avg = findViewById(R.id.Avarage);
        saveBtn = findViewById(R.id.saveButton);
        connectTxt = findViewById(R.id.connecting);
        saveBtn.setEnabled(false);
        lf = "0";
        lb = "0";
        rf = "0";
        rb = "0";
        temp = "0";
        temperature = findViewById(R.id.Temperature);
        if(btAdapter != null &&  !btAdapter.isEnabled()){
            Intent enableBT = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBT, 1);
        }
        if (this.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)!= PackageManager.PERMISSION_GRANTED){
            final AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("PetVet Requires access to your location");
            builder.setMessage("Please grant access so we can detect your scale");
            builder.setPositiveButton(android.R.string.ok, null);
            builder.setOnDismissListener(new DialogInterface.OnDismissListener() {
                @Override
                public void onDismiss(DialogInterface dialog) {
                    requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},1);
                }
            });
            builder.show();
        }

        btScanner.startScan(leScanCallback);
    }

private ScanCallback leScanCallback = new ScanCallback() {
         @Override
    public void onScanResult(int callbackType, ScanResult result) {
             String deviceName = result.getDevice().getName();

             Log.i("here", "again");
             if((device == null) && (deviceName != null) && deviceName.startsWith("PetVet")) {
                 Log.i("","found our device");

                 device = result.getDevice();
                 runOnUiThread(new Runnable() {
                     @Override
                     public void run() {
                         device.connectGatt(MainMeasureActivity.this, true, leGattCallBack, BluetoothDevice.TRANSPORT_LE);
                     }
                 });
             }
         }
    };

public UUID convertFromInteger(int i) {
        final long MSB = 0x0000000000001000L;
        final long LSB = 0x800000805f9b34fbL;
        long value = i & 0xFFFFFFFF;
        return new UUID(MSB | (value << 32), LSB);
}

private BluetoothGattCallback leGattCallBack = new BluetoothGattCallback() {
  @Override
  public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
      Log.i("onConnection", "status: " + status + ", newState: " +newState);
      if(newState == BluetoothProfile.STATE_CONNECTED) {
          Log.i("onConnection", "Discovering services");
          gatt.discoverServices();
          connectTxt.setTextColor(Color.parseColor("#"));
          connectTxt.setText("Connected");
      } else
          connectTxt.setText("Not Connected");
          gatt.close();
  }


  @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
      Log.i("onServicesDiscovered", "status: " + status);
      Log.i("Services", gatt.getServices().toString());

      BluetoothGattService measurementService= gatt.getService(UUID.fromString("000000ff-1fb5-459e-8fcc-c5c9c331914b"));
      if(measurementService == null)
          return;
      btScanner.stopScan(leScanCallback);

      BluetoothGattCharacteristic characteristic =   measurementService.getCharacteristic(UUID.fromString("0000ff01-36e1-4688-b7f5-ea07361b26a8"));

      gatt.setCharacteristicNotification(characteristic, true);
      BluetoothGattDescriptor descriptor = characteristic.getDescriptor(convertFromInteger((0x2902)));
      descriptor.setValue(
              BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
      gatt.writeDescriptor(descriptor);


  }
  @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
      if(characteristic.getUuid().toString().equals( "0000ff01-36e1-4688-b7f5-ea07361b26a8")) {
          final String data = characteristic.getStringValue(0);

          runOnUiThread(new Runnable() {

              @Override
              public void run() {
                 String value = data.substring(1);

          switch(data.substring(0,1)) {
              case "L":
                  lf = value;
                  Log.d("lf", lf);
                  leftF.setText(lf + "kg");
                  break;
              case "l":
                  lb = value;
                  Log.d("lb", lb);
                  leftB.setText(lb+"kg");
                  break;
              case "R":
                  rf = value;
                  rightF.setText(rf+"kg");
                  Log.d("rf", rf);
                  break;
              case "r":
                  rb = value;
                  rightB.setText(rb+"kg");
                  Log.d("rb", rb);
                  break;
              case "T":
                  temp = value;
                  Log.d("temp", temp);
                  temperature.setText(temp+"°C");

                  break;
          }
                  saveBtn.setEnabled(true);
          float avgfl = (Float.parseFloat(rf) + Float.parseFloat(rb) + Float.parseFloat(lf) + Float.parseFloat(rf))/4;
                  NumberFormat formatter = NumberFormat.getInstance(Locale.US);
                  String f = formatter.format(avgfl);
                  fo = f.substring(0,f.indexOf('.')+3);
          avg.setText(fo+"kg");
              }
          });
          if(data.startsWith("T")) {
              characteristic.setValue("1");
              gatt.writeCharacteristic(characteristic);
          }
          mgatt = gatt;
      }
  }

  @Override
  public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status){
      Log.i("OnDescriptorWrite", "written");
      BluetoothGattCharacteristic characteristic =
              gatt.getService(UUID.fromString("000000ff-1fb5-459e-8fcc-c5c9c331914b"))
                      .getCharacteristic(UUID.fromString("0000ff01-36e1-4688-b7f5-ea07361b26a8"));
      characteristic.setValue("1");
      Log.i("value", gatt.writeCharacteristic(characteristic) + "");
  }
    @Override
    public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        Log.i("write", "onCharacteristicWrite: " + status);
    }
};

    public void StopMeasuring(View view) {
        if (mgatt != null) {
            BluetoothGattCharacteristic characteristic =
                    mgatt.getService(UUID.fromString("000000ff-1fb5-459e-8fcc-c5c9c331914b"))
                            .getCharacteristic(UUID.fromString("0000ff01-36e1-4688-b7f5-ea07361b26a8"));
            characteristic.setValue("0");
            Log.d("send 0",mgatt.writeCharacteristic(characteristic) + "");
            mgatt = null;
        }
        Intent intent = new Intent(this,MainPetActivity.class);
        intent.putExtra("pet",currPet);
        startActivity(intent);
    }

    public void Save(View view) {
        Intent i = new Intent(this, SaveMeasurementActivity.class);
        i.putExtra("lf",lf);
        i.putExtra("lb",lb);
        i.putExtra("rf",rf);
        i.putExtra("rb",rb);
        i.putExtra("t",temp);
        i.putExtra("avg",fo);
        i.putExtra("pet",currPet);
        startActivity(i);
    }
}
