import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  proxy = "https://cors-anywhere.herokuapp.com/";
  url = "http://35.195.71.21:3000/";
  getOwnerData(uuid) {
    return this.http.get<owner>(this.proxy + this.url + "owner/" + uuid);
  }
  getVetData(uuid) {
    console.log(uuid)
    return this.http.get<owner>(this.proxy + this.url + "vet/" + uuid);
  }
  getPetData(uuid) {
    return this.http.get(this.proxy + this.url + "pet/owner/" + uuid);
  }
  getFullPetData(petid) {
    return this.http.get(this.proxy + this.url + "petdata/pet/" + petid);
  }
  getAllvet() {
    return this.http.get(this.proxy + this.url + "/vet/")
  }



  PostPersonData(uuid, name, age, surName, vet) {
    var postOwnerJsonstring;
    var objectpet
    if (vet) {
      var person = "vet/"
      console.log("vet")
      postOwnerJsonstring = "{\"uuid\":  \"" + uuid + "\","
        + " \"name\":  \"" + name + "\", "
        + " \"surName\":  \"" + surName + "\"}";
    }
    if (!vet) {
      var person = "owner/"
      console.log("owner")
      postOwnerJsonstring = "{\"uuid\":  \"" + uuid + "\","
        + " \"name\":  \"" + name + "\", "
        + " \"age\":  \"" + age + "\","
        + " \"surName\":  \"" + surName + "\"}";
    }


    var jsonPostOwner = JSON.parse(postOwnerJsonstring);
    console.log(jsonPostOwner);
    console.log(this.proxy + this.url + person)
    this.http.post<owner>(this.proxy + this.url + person, jsonPostOwner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  postPetData(uuid, name) {
    const postPetString = "{\"uuid\":  \"" + uuid + "\","
      + " \"name\":  \"" + name + "\"}";
    var jsonData = JSON.parse(postPetString);
    console.log(jsonData)
    return this.http.post<pet>(this.proxy + this.url + "pet/", jsonData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  PostPetVet(vetid, petid, name){
    var postpetvet = "{\"vet_uuid\":  \"" + vetid + "\","
    + " \"name\":  \"" + name +"\" }";
    var jsonpostvet = JSON.parse(postpetvet)
    console.log(jsonpostvet )

    return this.http.put(this.proxy+this.url+ "pet/" + petid, jsonpostvet,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }) 
    });
    // this.http.post(this.proxy + this.url+"pet/"+ petid, )
  }
}

export interface owner {
  uuid: string;
  name: string;
  surName: string;
  age: number
}
export interface pet {
  uuid: string;
  petId: number;
  name: string;
  vet_uuid: string
}