package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.ListView;


import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Arrays;

import static java.lang.Thread.sleep;

public class MyPetsActivity extends BaseActivity {

    private User tempUser;
     ListView listView;
    ArrayList<String> petnames;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_pets);

        tempUser = User.GetInstance();
        petnames = new ArrayList<>();
        listView = findViewById(R.id.list_view);
        final BaseAdapter arrayAdapter = new ArrayAdapter(this, android.R.layout.simple_list_item_1,petnames);
        listView.setAdapter(arrayAdapter);
        String URL = "http://35.195.71.21:3000/pet/owner/"+tempUser.GetId();

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
                        Pet[] petarray = gson.fromJson(response.toString(), Pet[].class);
                        ArrayList<Pet> pets = new ArrayList<Pet>(Arrays.asList(petarray));

                        tempUser.SetPets(pets);
                        for (Pet pet: tempUser.GetPets()
                        ) {
                            petnames.add(pet.name);
                        }
                        arrayAdapter.notifyDataSetChanged();
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
    listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            Intent i = new Intent(MyPetsActivity.this, MainPetActivity.class);
            Pet sendPet = tempUser.GetPets().get(position);
            i.putExtra("pet",sendPet);
            startActivity(i);
        }
    });




    }

    public void LaunchAddPetActivity(View view) {
        Intent i = new Intent(this, AddPetActivity.class);
        i.putExtra("user",tempUser.GetId());
        startActivity(i);
    }
}
