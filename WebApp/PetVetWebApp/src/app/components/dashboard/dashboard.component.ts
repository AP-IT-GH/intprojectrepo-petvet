import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { DataService, pet } from 'src/app/shared/services/data.service';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isVet: boolean;
  gotData: boolean = false;
  noData: boolean = false;
  ownerId: string
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private data: DataService,
  ) {

    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);


    this.ownerId = ownerJson.uid;

    this.data.getOwnerData(ownerJson.uid).subscribe((data) => {
      
      this.ownerName = data.name;
      this.ownerSurName = data.surName;
      var name = {
        name: data.name,
        surName: data.surName
      }
      var namestring = JSON.stringify(name)
      localStorage.setItem("Name", namestring)
      this.age = data.age;
      this.isVet = false;
      this.gotData = true
      this.noData = false;

    }, (error) => {
      if (error.status = 404) {

        this.isVet = true;
        this.data.getVetData(ownerJson.uid).subscribe((vet) => {


          this.ownerName = vet.name;
          this.ownerSurName = vet.surName;

          var name = {
            name: vet.name,
            surName: vet.surName
          }
          var namestring = JSON.stringify(name)
          localStorage.setItem("Name", namestring)

          this.gotData = true
          this.noData = false;
        }, (error) => {
          console.log(error)
          this.noData = true;
        }
        )}
    })
    
  }

      ngOnInit() {
      }



      ownerName: string
      ownerSurName: string
      age: number;
    }
