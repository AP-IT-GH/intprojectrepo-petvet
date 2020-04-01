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
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;

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

            pet tempPet = new pet(UserId, petnametext.getText().toString());
            Log.e("name: ", petnametext.getText().toString());
            String data = "";
            try {
                jsonObject = new JSONObject(data);
                jsonObject.put("uuid", tempPet.uuid);
                jsonObject.put("name", tempPet.name);
            }catch (Exception e) {
                e.printStackTrace();
            }

            JsonObjectRequest objectRequest = new JsonObjectRequest(
                    Request.Method.POST,
                    URL,jsonObject,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                        Log.e("response: ",response.toString());
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("error: ",error.toString());
                        }
                    }
            );
            requestQueue.add(objectRequest);
            Intent i = new Intent(this, MyPets.class);

            startActivity(i);
        }else {
            Toast toast = Toast.makeText(this,"add pet denied",Toast.LENGTH_SHORT);
            toast.show();
        }
    }
}
