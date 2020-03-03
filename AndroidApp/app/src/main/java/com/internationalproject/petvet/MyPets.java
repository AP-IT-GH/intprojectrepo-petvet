package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import java.util.ArrayList;

public class MyPets extends AppCompatActivity {

    private User tempUser;
    private pet tempPet1, tempPet2;
    private ArrayList<pet> tempPets;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_pets);
        tempPet1 = new pet(0,"Bert");
        tempPet2 = new pet(1,"Emma");
        tempPets.add(tempPet1);
        tempPets.add(tempPet2);
        tempUser = new User(0,tempPets);
    }
}
