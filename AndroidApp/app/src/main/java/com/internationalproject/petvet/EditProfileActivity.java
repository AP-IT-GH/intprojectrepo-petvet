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
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class EditProfileActivity extends AppCompatActivity {
    EditText nameEdit, surnameEdit, ageEdit;
    User currUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);
        nameEdit = findViewById(R.id.editname);
        surnameEdit = findViewById(R.id.editsurName);
        ageEdit = findViewById(R.id.editage);

        String URL = "http://35.195.71.21:3000/owner/" + User.GetInstance().GetId();
        //get request voor dropdown/spinner
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        JsonObjectRequest objectRequest = new JsonObjectRequest(
                Request.Method.GET,
                URL,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.e("Error",response.toString());
                        Gson gson = new Gson();
                        currUser = gson.fromJson(response.toString(), User.class);
                        nameEdit.setText(currUser.name);
                        surnameEdit.setText(currUser.surName);
                        ageEdit.setText(currUser.age+"");

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("Error",error.toString());
                    }
                }
        );
        requestQueue.add(objectRequest);

    }

    public void Cancel(View view) {
        finish();
    }

    public void Confirm(View view) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        if (nameEdit.getText().toString().trim().length() > 0 && surnameEdit.getText().toString().trim().length() > 0 && ageEdit.getText().toString().trim().length() > 0) {
            String URL = "http://35.195.71.21:3000/owner/" + User.GetInstance().GetId();

            final Toast toastupdated = Toast.makeText(this, "your profile has been updated", Toast.LENGTH_SHORT);

            StringRequest stringRequest = new StringRequest(Request.Method.PUT, URL, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    Log.e("response: ", response.toString());

                    toastupdated.show();
                }
            },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("error: ", error.toString());
                        }
                    }) {
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put("name",nameEdit.getText().toString());
                    params.put("surName", surnameEdit.getText().toString());
                    params.put("age",ageEdit.getText().toString());
                    return params;
                }

            };
            requestQueue.add(stringRequest);


            finish();
        }else{
            final Toast toastfailed = Toast.makeText(this, "Profile could not be updated, please ensure there are no empty fields", Toast.LENGTH_SHORT);
            toastfailed.show();
        }
    }
}
