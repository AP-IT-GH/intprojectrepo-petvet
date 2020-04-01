package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.app.DownloadManager;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class AddPetActivity extends AppCompatActivity {

    String UserId;
    String URL = "http://35.195.71.21:3000/pet/";
    EditText petnametext;
    JSONObject jsonObject;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_pet);
        UserId = getIntent().getExtras().getString("user");
        petnametext = findViewById(R.id.petNameText);


    }

    public void AddPet(View view) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        if (petnametext.getText().toString().trim().length() > 0) {

            final pet tempPet = new pet(UserId, petnametext.getText().toString());
            Log.e("name: ", petnametext.getText().toString());
            final Toast toastadded = Toast.makeText(this,"Pet has been added",Toast.LENGTH_SHORT);
            StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.e("response: ",response.toString());

                    toastadded.show();
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
                    params.put("uuid", tempPet.uuid);
                    params.put("name", tempPet.name);
                    return params;
                }

            };
            requestQueue.add(stringRequest);
            Intent i = new Intent(this, MyPets.class);

            startActivity(i);
        }else {
            Toast toast = Toast.makeText(this,"add pet denied",Toast.LENGTH_SHORT);
            toast.show();
        }
    }
}
