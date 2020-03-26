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
  petsowner:any[];
  
ownerId:string
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private data : DataService,
    private userid: AuthService  ) 
    {
      
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

    this.data.getOwnerData(ownerJson.uid).subscribe( data => {
      this.ownerName = data.name;
      this.ownerSurName = data.surName;
      this.age = data.age;
      })

      this.data.getPetData().subscribe(pet=>{
        this.pets=pet;
        console.log(this.pets)


// for(var num= 0; num < this.pets.length; num++){
// this.petsowner.push(this.pets[num])
// }

        
      })
   }
   

   ngOnInit() {
  }

value:string
  onEnter(value : string,){
    this.value = value

this.data.postPetData(this.ownerId, value).subscribe(
  (pet:pet)=> {
    console.log(pet);
  },
  (error:any)=>console.log(error)
)
  }












ownerName:string
ownerSurName:string
age:number;
}
