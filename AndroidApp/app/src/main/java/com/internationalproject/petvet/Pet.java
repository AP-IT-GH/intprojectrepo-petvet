package com.internationalproject.petvet;

import java.io.Serializable;

class pet implements Serializable {
    public String name;
    public int petId;
    public String uuid;
    public String vet_uuid;

    public pet(String uuid,int id, String name){
        this.uuid = uuid;
        this.petId = id;
        this.name = name;
    }
    public pet(String uuid, String name){
        this.uuid = uuid;

        this.name = name;
    }
}
