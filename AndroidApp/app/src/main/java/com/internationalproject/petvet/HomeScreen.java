package com.internationalproject.petvet;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
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

public class HomeScreen extends AppCompatActivity {

    private User tempUser;
    ListView listView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);
        tempUser = new User("rdPZmdidJ3YmTgVSaKlxinoWFVK2");

        String URL = "http://10.0.2.2:3000/pet/owner/"+tempUser.GetId();

        RequestQueue requestQueue = Volley.newRequestQueue(this);

        JsonArrayRequest arrayRequest = new JsonArrayRequest(
                Request.Method.GET,
                URL,
                null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        Gson gson = new Gson();
                        pet[] petarray = gson.fromJson(response.toString(),pet[].class);
                        ArrayList<pet> pets = new ArrayList<pet>(Arrays.asList(petarray));

                        tempUser.SetPets(pets);
                        Log.e("test", tempUser.GetPets().get(1).name.toString());
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
        ArrayList<String> petnames = new ArrayList<>();

        for (pet pet: tempUser.GetPets()
        ) {
            petnames.add(pet.name);
        }

        listView = findViewById(R.id.list_view);
        ArrayAdapter arrayAdapter = new ArrayAdapter(this, android.R.layout.simple_list_item_1,petnames);
        listView.setAdapter(arrayAdapter);
    }
}
