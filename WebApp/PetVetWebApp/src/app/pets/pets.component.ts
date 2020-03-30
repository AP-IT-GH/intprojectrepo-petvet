import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/shared/services/auth.service";
import { DataService, pet } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {


  pets:any=[];
  petDatas:any=[];
  ownerId:string
  constructor(public authService: AuthService,
              private data : DataService
    ) { 
      let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

  this.data.getPetData(this.ownerId).subscribe(pet=>{
    this.pets=pet;
    this.onChangePet(this.pets[0].petId)
    
   })

  }


  onChangePet(petid) {
    this.petDatas = [];
    console.log(petid);
    this.data.getFullPetData(petid).subscribe(Data =>{      
      this.petDatas.push(Data);
    })
}
  onChangeDate(num){
    this.date = this.petDatas[num].date
    this.frontLeft = this.petDatas[num].frontLeft
    this.frontRight = this.petDatas[num].frontRight
    this.backLeft = this.petDatas[num].backLeft
    this.backRight = this.petDatas[num].backRight
    this.petid = this.petDatas[num].petId
    this.dataid = this.petDatas[num].dataid
    this.temperature = this.petDatas[num].temperature
  }
  date:Date;
  frontRight:number
  frontLeft:number
  backRight:number
  backLeft:number
  petid:number
  dataid:number
  temperature:number


  value:string
  onEnter(value : string,){
    this.value = value
    
this.data.postPetData(this.ownerId, value).subscribe(
  (pet:pet)=> {
    this.pets.push(pet)
  },
  (error:any)=>console.log(error)
)
this.value = "";
  }

  ngOnInit() {

  }

}
