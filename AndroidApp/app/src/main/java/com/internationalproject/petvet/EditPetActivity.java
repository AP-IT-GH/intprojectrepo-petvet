package com.internationalproject.petvet;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

public class EditPetActivity extends AppCompatActivity {

    EditText nameTxt;
    Spinner vetSpinner;
    Button confirmBtn, cancelBtn;
    Pet currPet;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_pet);
        nameTxt = findViewById(R.id.editName);
        vetSpinner = findViewById(R.id.editVet);
        cancelBtn = findViewById(R.id.cancelButton);
        confirmBtn = findViewById(R.id.confirmButton);
        Intent intent = getIntent();
        currPet = (Pet)intent.getSerializableExtra("pet");
        nameTxt.setText(currPet.name);
    }

    public void Cancel(View view) {
        Intent i = new Intent(EditPetActivity.this, MainPetActivity.class);
        startActivity(i);
    }

    public void Confirm(View view) {
    }
}
