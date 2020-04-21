package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


public class EditPetActivity extends AppCompatActivity {

    EditText nameTxt;
    Spinner vetSpinner;
    Button confirmBtn, cancelBtn;
    Pet currPet;
    ArrayList<String> vetNamesString;
    Vet[] allVets;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_pet);
        nameTxt = findViewById(R.id.editName);
        vetSpinner = findViewById(R.id.editVet);
        cancelBtn = findViewById(R.id.cancelButton);
        confirmBtn = findViewById(R.id.confirmButton);
        vetNamesString = new ArrayList<>();
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
        nameTxt.setText(currPet.name);
        final ArrayAdapter<String> adapter = new ArrayAdapter<>(EditPetActivity.this,android.R.layout.simple_spinner_dropdown_item,vetNamesString);
        vetSpinner.setAdapter(adapter);
        String URL = "http://35.195.71.21:3000/vet/";
        //get request voor dropdown/spinner
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        JsonArrayRequest arrayRequest = new JsonArrayRequest(
                Request.Method.GET,
                URL,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.e("response: ",response.toString());
                        Gson gson = new Gson();
                        allVets = gson.fromJson(response.toString(), Vet[].class);


                            vetNamesString.add("none");
                        for (Vet vet: allVets) {
                            vetNamesString.add(vet.surName +" "+vet.name);
                        }
                        adapter.notifyDataSetChanged();
                        if (currPet.vet_uuid != null){
                            ArrayList<Vet> Listvets = new ArrayList<>(Arrays.asList(allVets));
                            for (Vet vet: Listvets){
                                Log.e("oof",vet.uuid + " " + currPet.vet_uuid);
                                if (vet.uuid.equals(currPet.vet_uuid)){
                                    vetSpinner.setSelection(Listvets.indexOf(vet)+1);
                                    break;
                                }
                            }
                        }else{
                            vetSpinner.setSelection(0);
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("Error",error.toString());
                    }
                }
        );
        requestQueue.add(arrayRequest);


    }

    public void Cancel(View view) {
        finish();
    }

    public void Confirm(View view) {
        Pet updatePet = new Pet();

        if (vetSpinner.getSelectedItem().toString() != "none") {
            updatePet = new Pet(currPet.uuid, currPet.petId, nameTxt.getText().toString(), allVets[vetSpinner.getSelectedItemPosition() - 1].uuid);
        } else {
            updatePet = new Pet(currPet.uuid, currPet.petId, nameTxt.getText().toString());
        }
        final Pet tempPet = updatePet;
        //Put request voor updaten pet
        RequestQueue requestQueue = Volley.newRequestQueue(this);

        if (nameTxt.getText().toString().trim().length() > 0) {
            String URL = "http://35.195.71.21:3000/pet/" + currPet.petId;

            final Toast toastupdated = Toast.makeText(this, "Pet has been updated", Toast.LENGTH_SHORT);

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
                    params.put("uuid", tempPet.uuid);
                    params.put("name", tempPet.name);
                    if (tempPet.vet_uuid != null) {
                        params.put("vet_uuid", tempPet.vet_uuid);
                    }
                    return params;
                }

            };
            requestQueue.add(stringRequest);


            Intent i = new Intent(this, MainPetActivity.class);
            i.putExtra("pet",tempPet);
            startActivity(i);
        }else{
            final Toast toastfailed = Toast.makeText(this, "Pet update failed, name can't be empty", Toast.LENGTH_SHORT);
            toastfailed.show();
        }
    }
}
