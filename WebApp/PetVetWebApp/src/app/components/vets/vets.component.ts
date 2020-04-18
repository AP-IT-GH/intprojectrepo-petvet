import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-vets',
  templateUrl: './vets.component.html',
  styleUrls: ['./vets.component.css']
})
export class VetsComponent implements OnInit {

  public testChart: Object[];
  public xAxis: Object;
  public yAxis1: Object;
  public yAxis2: Object;
  public legend: Object;
  public markerSettings: Object;
  public tooltipSettings: Object;
  public zoom: Object;

multi = true;
  allPets: any = [];
  vetId: string
  pets: any = [];
  petDatas: any = [];
  ownerPet: any =[];
  constructor(public authService: AuthService,
    private data: DataService) {
         //ChartSettings
    this.tooltipSettings = {
      enable: true
    }
    this.markerSettings = {
      visible: true,
      dataLabel: {
        visible: true
      }
    }
    this.xAxis = {
      title: 'Date',
      valueType: 'DateTime',
      labelFormat: 'd/M/y',
      rangePadding: 'Additional'
    }
    this.yAxis1 = {
      title: 'Weight',
    }
    this.yAxis2 = {
      title: 'Temperature',
    }
    this.legend = {
      visible: true
    };
    this.zoom = {
      enablePinchZooming: true,
      enableSelectionZooming: true
    };

    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.vetId = ownerJson.uid;


    this.data.getpetsfromvet(this.vetId).subscribe(pet => {
      this.pets = pet
      this.allPets = [];

      this.pets.forEach((x, index) => {
        this.allPets.push(x)
        this.data.getFullPetData(x.petId).subscribe((petdata) => {
          this.allPets[index].petData = [];
          this.petDatas = [];
          this.petDatas = petdata;
          this.petDatas.forEach(y => {
            this.allPets[index].petData.push(y)
          });
        }, (error: any) => console.log(error))
      });
    }, (error: any) => console.log(error))


  }


  ngOnInit() {
    this.data.getAllOwner().subscribe((allvet: any) => {
      allvet.forEach(x => {
        this.ownerPet.push(x)
      }, (error: any) => console.log(error));
    })
  }

}
