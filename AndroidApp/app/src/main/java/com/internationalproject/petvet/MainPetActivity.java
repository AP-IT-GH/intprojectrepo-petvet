package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import java.text.SimpleDateFormat;

public class MainPetActivity extends BaseActivity {

    TextView nametxt,vettxt,entriestxt;
    Button editBtn,measureBtn;
    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pet_main);
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
        Log.e("pet: ",currPet.name);
        nametxt = findViewById(R.id.petnameText);
        vettxt = findViewById(R.id.vetnameText);
        entriestxt = findViewById(R.id.lastEntriesText);
        editBtn = findViewById(R.id.editButton);
        measureBtn = findViewById(R.id.measureButton);
        Log.e("text",nametxt.getText().toString());
        nametxt.setText(currPet.name);
        if (currPet.vet_uuid != null){
            String URL = "http://35.195.71.21:3000/vet/"+ currPet.vet_uuid;
            RequestQueue requestQueue = Volley.newRequestQueue(this);
            StringRequest stringRequest = new StringRequest(Request.Method.GET, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.e("response: ",response.toString());
                    Gson gson = new Gson();
                    Vet tempVet = gson.fromJson(response.toString(),Vet.class);
                    vettxt.setText("Assigned vet: \n" + tempVet.surName + " " + tempVet.name);
                }
            },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("error: ",error.toString());
                        }
                    });
            requestQueue.add(stringRequest);
        }
        String URL = "http://35.195.71.21:3000/petData/pet/5/"+ currPet.petId;
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.e("response: ",response.toString());
                Gson gson = new Gson();
                PetData[] tempDataArray = gson.fromJson(response.toString(),PetData[].class);
                String datastring = "\n";
                for ( PetData petData: tempDataArray){
                    SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
                    String newDate= format.format(petData.date);
                    datastring += newDate + "\n";
                }
                entriestxt.setText("Dates of the last 5 measurements:" + datastring);
            }
        },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("error: ",error.toString());
                    }
                });
        requestQueue.add(stringRequest);

    }

    public void LaunchEditActivity(View view) {
        Intent i = new Intent(MainPetActivity.this, EditPetActivity.class);
        i.putExtra("pet",currPet);
        startActivity(i);
    }

    public void LaunchMeasureActivity(View view) {
        Intent i = new Intent(MainPetActivity.this, MainMeasureActivity.class);
        i.putExtra("pet",currPet);
        startActivity(i);
    }
}
