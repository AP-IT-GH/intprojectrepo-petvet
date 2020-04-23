package com.internationalproject.petvet;

import java.util.ArrayList;
import java.util.EventListener;

class User {
    public String _id;
    private ArrayList<Pet> _pets = new ArrayList<>();
    private static User instance = null;
    public String name;
    public String surName;
    public int age;
    public User(){
        this._pets = new ArrayList<>();
    }

    public User(String id){
        this._id = id;
        this._pets = new ArrayList<>();
        instance = this;

    }
  /*  public User(String id, ArrayList<Pet> pets){
        this._id = id;
        this._pets = pets;
    }*/
    public String GetId(){
        return _id;
    }
    public ArrayList<Pet> GetPets(){
        return _pets;
    }
    public void SetPets(ArrayList<Pet> pets){
        this._pets = pets;
    }

    public static User GetInstance()
    {
        if (instance == null)
        {
            instance = new User();
        }
            return  instance;
    }
}
