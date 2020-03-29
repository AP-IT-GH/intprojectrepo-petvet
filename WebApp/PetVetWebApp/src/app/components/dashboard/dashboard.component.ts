import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { DataService, pet } from 'src/app/shared/services/data.service';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  pets:any=[];

  
ownerId:string
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private data : DataService,
      ) 
    {
      
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    var isVet = false;
    
    this.ownerId = ownerJson.uid;

    this.data.getOwnerData(ownerJson.uid).subscribe((data) =>
    {
      console.log(data)
      this.ownerName = data.name;
      this.ownerSurName = data.surName;
       this.age = data.age;
    }, (error) =>
    {
        console.log(error);
        if( error.status = 404){
          isVet = true;
          this.data.getVetData(ownerJson.uid).subscribe((vet)=>{
            this.ownerName = vet.name;
            this.ownerSurName = vet.surName;
          })
        }
    });
    


      this.data.getPetData(this.ownerId).subscribe(pet=>{
        this.pets=pet;
        console.log(this.pets)
        
       })
   }
   
   ngOnInit() {
  }

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

ownerName:string
ownerSurName:string
age:number;
}
