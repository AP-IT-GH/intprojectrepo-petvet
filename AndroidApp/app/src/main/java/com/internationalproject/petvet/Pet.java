package com.internationalproject.petvet;

import java.io.Serializable;

class Pet implements Serializable {
    public String name;
    public int petId;
    public String uuid;
    public String vet_uuid;

    public Pet(String uuid, int id, String name){
        this.uuid = uuid;
        this.petId = id;
        this.name = name;
    }
    public Pet(String uuid, String name){
        this.uuid = uuid;

        this.name = name;
    }
}
