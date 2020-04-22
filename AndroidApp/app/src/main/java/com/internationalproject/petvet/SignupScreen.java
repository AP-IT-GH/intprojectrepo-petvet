package com.internationalproject.petvet;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

import java.util.HashMap;
import java.util.Map;

public class SignupScreen extends AppCompatActivity {
    EditText emailId, password,namefield,surnamefield,agefield;
    Button btnSignUp;
    TextView tvSignIn;
    FirebaseAuth mFirebaseAuth;
    public  String uuid;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup_screen);
        getSupportActionBar().hide();
        mFirebaseAuth = FirebaseAuth.getInstance();
        emailId = findViewById(R.id.emailField);
        password = findViewById(R.id.passwordField);
        btnSignUp = findViewById(R.id.btnLogIn);
        tvSignIn = findViewById(R.id.txtToLogIn);
        namefield =findViewById(R.id.nameField);
        surnamefield =findViewById(R.id.surnameField);
        agefield =findViewById(R.id.ageField);

        btnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailId.getText().toString();
                String pwd = password.getText().toString();
               final String name = namefield.getText().toString();
                final String surname = surnamefield.getText().toString();
                final String age = agefield.getText().toString();
                if (email.isEmpty())
                {
                    emailId.setError("Please enter email");
                    emailId.requestFocus();
                }
                else if(pwd.isEmpty())
                {
                    password.setError("Please enter your password");
                    password.requestFocus();
                } else if(name.isEmpty())
                {
                    namefield.setError("Please enter your password");
                    namefield.requestFocus();
                }
                else if(surname.isEmpty())
                {
                    surnamefield.setError("Please enter your password");
                    surnamefield.requestFocus();
                } else if(age.isEmpty())
                {
                    agefield.setError("Please enter your password");
                    agefield.requestFocus();
                }
                else if(email.isEmpty() && pwd.isEmpty() && name.isEmpty() && surname.isEmpty() && age.isEmpty())
                {
                    Toast.makeText(getApplicationContext(), "Fields are empty!", Toast.LENGTH_SHORT).show();
                }
                else if(!(email.isEmpty() && pwd.isEmpty()))
                {
                    mFirebaseAuth.createUserWithEmailAndPassword(email,pwd).addOnCompleteListener(SignupScreen.this, new OnCompleteListener<AuthResult>() {
                        @Override
                        public void onComplete(@NonNull Task<AuthResult> task) {
                            if(!task.isSuccessful())
                            {
                                Toast.makeText(getApplicationContext(), "Signup Unsuccessfull! Please try again", Toast.LENGTH_SHORT).show();
                            }
                            else
                            {
                                uuid = mFirebaseAuth.getUid();
                                User tempUser = User.GetInstance();
                                tempUser._id = uuid;
                                String URL = "http://35.195.71.21:3000/owner";
                                RequestQueue requestQueue = Volley.newRequestQueue(SignupScreen.this);
                                    StringRequest stringRequest = new StringRequest(Request.Method.POST, URL, new Response.Listener<String>() {
                                        @Override
                                        public void onResponse(String response) {
                                            Log.e("response: ",response.toString());
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
                                            params.put("uuid", uuid);
                                            params.put("name", name);
                                            params.put("surName",surname);
                                            params.put("age", age);
                                            return params;
                                        }

                                    };
                                    requestQueue.add(stringRequest);
                                startActivity(new Intent(SignupScreen.this, MyPetsActivity.class));
                            }
                        }
                    });
                }
            }
        });
        tvSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(SignupScreen.this,LoginScreen.class);
                startActivity(i);
            }
        });

    }
}
