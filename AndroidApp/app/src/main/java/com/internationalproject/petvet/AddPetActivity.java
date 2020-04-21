package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

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
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.util.HashMap;
import java.util.Map;

public class AddPetActivity extends AppCompatActivity {

    String UserId;
    String URL = "http://35.195.71.21:3000/pet/";
    EditText petnametext;
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

            final Pet tempPet = new Pet(UserId, petnametext.getText().toString());

            Log.e("name: ", petnametext.getText().toString());
            Log.e("name",tempPet.name);
            Log.e("user",tempPet.uuid);
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
            Intent i = new Intent(this, MyPetsActivity.class);

            startActivity(i);
        }else {
            Toast toast = Toast.makeText(this,"add pet denied",Toast.LENGTH_SHORT);
            toast.show();
        }
    }
}
