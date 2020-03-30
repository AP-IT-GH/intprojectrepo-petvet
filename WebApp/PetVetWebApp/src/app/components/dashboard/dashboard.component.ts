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
   }
   
   ngOnInit() {
  }



ownerName:string
ownerSurName:string
age:number;
}
