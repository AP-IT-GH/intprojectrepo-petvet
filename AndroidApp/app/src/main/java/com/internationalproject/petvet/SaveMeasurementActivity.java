package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SaveMeasurementActivity extends AppCompatActivity {
    String lf, rf, lb, rb, temp,dateString,avarage;
    TextView leftF,leftB,rightF,rightB,avg,temperature;
    Date date;
    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_save_measurement);
        getSupportActionBar().hide();
        Intent intent = getIntent();
        lf = intent.getStringExtra("lf");
        lb = intent.getStringExtra("lb");
        rf = intent.getStringExtra("rf");
        rb = intent.getStringExtra("rb");
        temp = intent.getStringExtra("t");
        avarage = intent.getStringExtra("avg");
        currPet = (Pet)intent.getSerializableExtra("pet");
        leftF = findViewById(R.id.LeftFront);
        leftB = findViewById(R.id.LeftBack);
        rightF = findViewById(R.id.RightFront);
        rightB = findViewById(R.id.RightBack);
        avg = findViewById(R.id.Avarage);
        temperature = findViewById(R.id.Temperature);
        leftF.setText(lf + "kg");
        leftB.setText(lb + "kg");
        rightB.setText(rb + "kg");
        rightF.setText(rf + "kg");
        avg.setText(avarage+"kg");
        temperature.setText(temp + "°C");
        date = Calendar.getInstance().getTime();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateString = simpleDateFormat.format(date);


    }

    public void Cancel(View view) {
        finish();
    }

    public void Save(View view) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);





           String URL = "http://35.195.71.21:3000/petData/";
            StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.e("response: ",response.toString());
                    finish();

                }
            },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("error: ",error.toString());
                        }
                    }){
                @Override
                protected Map<String, String> getParams()
                {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put("date", dateString);
                    params.put("frontRight",rf);
                    params.put("frontLeft",lf);
                    params.put("backRight",rb);
                    params.put("backLeft",lb);
                    params.put("petId", currPet.petId+"");
                    params.put("temperature",temp);
                    return params;
                }

            };
            requestQueue.add(stringRequest);

    }
}
