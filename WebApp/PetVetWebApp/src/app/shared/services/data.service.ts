import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
  import { from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http : HttpClient ) { }
proxy = "https://cors-anywhere.herokuapp.com/";
url = "http://35.195.71.21:3000/";
  getOwnerData(uuid){ 
    console.log(uuid)
    return this.http.get<owner>(this.proxy+this.url+"owner/"+ uuid);
  }
  getPetData(uuid){
    return this.http.get(this.proxy+this.url+"pet/owner/"+uuid)
  }
  
  
  
  
  
  postPetData(uuid, name){

    const postPet = "{\"uuid\":  \"" + uuid + "\","
    + " \"name\":  \"" + name+ "\"}";
    console.log(postPet);
    var jsonData = JSON.parse(postPet)
    console.log(jsonData)
    return this.http.post<pet>(this.proxy+this.url+"pet/", jsonData,{
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     } );
    
  }
}

export interface owner{
  uuid:string;
  name:string;
  surName:string;
  age:number
}
export interface pet{
  uuid:string;
  petId:number;
  name:string;
  vet_uuid:string
}