package com.internationalproject.petvet;

import java.util.ArrayList;

class User {
    private String _id;
    private ArrayList<Pet> _pets = new ArrayList<>();

    public User(String id){
        this._id = id;
        this._pets = new ArrayList<>();
    }
    public User(String id, ArrayList<Pet> pets){
        this._id = id;
        this._pets = pets;
    }
    public String GetId(){
        return _id;
    }
    public ArrayList<Pet> GetPets(){
        return _pets;
    }
    public void SetPets(ArrayList<Pet> pets){
        this._pets = pets;
    }

}
