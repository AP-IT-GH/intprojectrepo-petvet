package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

public class MainMeasureActivity extends AppCompatActivity {

    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_measure_main);
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
    }
}
