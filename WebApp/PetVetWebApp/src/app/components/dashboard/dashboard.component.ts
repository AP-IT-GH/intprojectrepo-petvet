import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { DataService } from 'src/app/shared/services/data.service';
import { VirtualTimeScheduler } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private getData : DataService
    , private userid: AuthService
  ) {

    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    console.log(owner);
    console.log(ownerJson.uid);


    
         this.getData.getOwnerData(ownerJson.uid).subscribe( data => {
              console.log(data);
            this.ownerName = data.name;
            this.ownerSurName = data.surName;
            this.age = data.age;
            })


    // console.log(userid.userData);
    // this.getData.getOwnerData("").subscribe( data => {
    //   console.log(data);
    // })
   }
ownerName:string
ownerSurName:string
age:number;
  ngOnInit() {

   }

}
