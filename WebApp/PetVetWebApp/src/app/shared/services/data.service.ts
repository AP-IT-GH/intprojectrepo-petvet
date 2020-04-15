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
    return this.http.get(this.proxy + this.url + "vet/")
  }
  getAllOwner() {
    return this.http.get(this.proxy + this.url + "/owner/")
  }
  getpetsfromvet(id) {
    return this.http.get(this.proxy + this.url + "pet/vet/" + id)

  }

  PostPersonData(uuid, name, age, surName, vet) {
    var postpersonJson;
    if (vet) {
      var person = "vet/"
      postpersonJson = {
        uuid: uuid,
        name: name,
        surName: surName
      }
    }
    if (!vet) {
      var person = "owner/"
      postpersonJson = {
        uuid: uuid,
        name: name,
        age: age,
        surName: surName
      }
    }
    this.http.post<owner>(this.proxy + this.url + person, postpersonJson, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe((error => {
      console.log(error)
    }));
  }

  postPetData(uuid, name) {
    var postPetJson = {
      uuid: uuid,
      name: name
    }
    return this.http.post<pet>(this.proxy + this.url + "pet/", postPetJson, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  PostPetVet(vetid, petid, name) {
 
    var postpetvetJson = {
      vet_uuid: vetid,
      name: name
    }

    return this.http.put(this.proxy + this.url + "pet/" + petid, postpetvetJson, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deletePet(petId) {
    return this.http.delete(this.proxy+this.url + "pet/"+ petId)
  }
  deletePetData(dataId) {
     return this.http.delete(this.proxy + this.url + "petData/" + dataId)
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