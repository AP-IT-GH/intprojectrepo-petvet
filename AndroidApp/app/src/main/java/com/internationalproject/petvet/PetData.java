package com.internationalproject.petvet;

import java.util.Date;

public class PetData {
    public Date date;
    public String frontRight,frontLeft,backRight,backLeft;
    public int petId,dataId;
    public double temperature;

    public PetData(Date Date, String FrontRight, String FrontLeft, String BackRight, String BackLeft, int Petid, int id, double Temp){
        date = Date;
        frontRight = FrontRight;
        frontLeft = FrontLeft;
        backLeft = BackLeft;
        backRight = BackRight;
        petId = Petid;
        dataId = id;
        temperature = Temp;

    }
}
