package com.internationalproject.petvet;

class pet {
    public String name;
    public int id;
    public String uuid;
    public String vet_uuid;

    public pet(String uuid,int id, String name){
        this.uuid = uuid;
        this.id = id;
        this.name = name;
    }
    public pet(String uuid, String name){
        this.uuid = uuid;

        this.name = name;
    }
}
