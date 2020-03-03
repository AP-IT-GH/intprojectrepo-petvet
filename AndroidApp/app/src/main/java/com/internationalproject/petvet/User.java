package com.internationalproject.petvet;

import java.util.ArrayList;

class User {
    private int _id;
    private ArrayList<Integer> _pets = new ArrayList<>();

    public User(int id, ArrayList<Integer> pets){
        this._id = id;
        this._pets = pets;
    }

}
