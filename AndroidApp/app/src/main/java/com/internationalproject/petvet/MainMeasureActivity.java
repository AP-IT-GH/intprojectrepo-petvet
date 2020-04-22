package com.internationalproject.petvet;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class MainMeasureActivity extends BaseActivity {

    BluetoothManager btManager;
    BluetoothAdapter btAdapter;
    BluetoothLeScanner btScanner;
    ScanSettings settings;
    BluetoothDevice device = null;

    String lf, rf, lb, rb, temp;

    private Map<String, String> mScanResults =new HashMap<>();

    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_measure_main);
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
        btManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        btAdapter = btManager.getAdapter();
        btScanner = btAdapter.getBluetoothLeScanner();

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
       // ScanSettings settings = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();
        //List<ScanFilter> filters = new ArrayList<>();
        //ScanFilter scanFilter = new ScanFilter.Builder().setServiceUuid(ParcelUuid.fromString("000000ff-1fb5-459e-8fcc-c5c9c331914b")).build();
        //filters.add(scanFilter);
        //btScanner.startScan(filters,settings, leScanCallback);
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
                 Handler mHandler = new Handler(MainMeasureActivity.this.getMainLooper());
                 mHandler.post(new Runnable() {
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
      } else
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
          String data = characteristic.getStringValue(0);

          String value = data.substring(1);

          switch(data.substring(0,1)) {
              case "L":
                  lf = value;
                  Log.d("lf", lf);
                  break;
              case "l":
                  lb = value;
                  Log.d("lb", lb);
                  break;
              case "R":
                  rf = value;
                  Log.d("rf", rf);
                  break;
              case "r":
                  rb = value;
                  Log.d("rb", rb);
                  break;
              case "T":
                  temp = value;
                  Log.d("temp", temp);
                  break;
          }
//            gatt.disconnect();
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
}
