package com.internationalproject.petvet;

import java.util.ArrayList;

class User {
    private String _id;
    private ArrayList<pet> _pets = new ArrayList<>();

    public User(String id){
        this._id = id;
        this._pets = new ArrayList<>();
    }
    public User(String id, ArrayList<pet> pets){
        this._id = id;
        this._pets = pets;
    }
    public String GetId(){
        return _id;
    }
    public ArrayList<pet> GetPets(){
        return _pets;
    }
    public void SetPets(ArrayList<pet> pets){
        this._pets = pets;
    }

}
