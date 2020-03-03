package com.internationalproject.petvet;

import java.util.ArrayList;

class User {
    private int _id;
    private ArrayList<pet> _pets = new ArrayList<>();

    public User(int id, ArrayList<pet> pets){
        this._id = id;
        this._pets = pets;
    }

}
