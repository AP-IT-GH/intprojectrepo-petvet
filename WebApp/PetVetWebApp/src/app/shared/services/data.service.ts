import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
  import { from } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http : HttpClient ) { }
proxy = "https://cors-anywhere.herokuapp.com/";
url = "http://35.195.71.21:3000/owner/";
  getOwnerData(uuid ){

   
    console.log(uuid)
    return this.http.get<owner>(this.proxy+this.url+ uuid);
  }
}

export interface owner{
  uuid:string;
  name:string;
  surName:string;
  age:number
}