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
  public majorGridLines;
  public lineStyle;

  searchPet
  name;
  surName;

  multi = true;
  allPets: any = [];
  vetId: string
  pets: any = [];
  petDatas: any = [];
  ownerPet: any = [];
  last5Temp: any;
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

    let Name = localStorage.getItem("Name")
    var NameJson = JSON.parse(Name)
    this.name = NameJson.name;
    this.surName = NameJson.surName;


    this.data.getpetsfromvet(this.vetId).subscribe(pet => {
      this.pets = pet
      this.allPets = [];

      this.pets.forEach((x, index) => {
        this.allPets.push(x)

        this.data.getFullPetData(x.petId).subscribe((petdata) => {
          this.data.getLast5datepets(x.petId).subscribe((last5 => {
            this.last5Temp = this.getAverage(last5);
            this.allPets[index].average5 = this.last5Temp
          }))
          this.allPets[index].petData = [];
          this.petDatas = [];
          this.petDatas = petdata;
          this.petDatas.forEach(y => {
            y.weight = (Number(y.frontRight) + Number(y.frontLeft) + Number(y.backRight) + Number(y.backLeft))
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

  getAverage(data) {
    var frontLeft = 0;
    var frontRight = 0;
    var backRight = 0;
    var backLeft = 0;
    var temperature = 0;
    var i = 0;
    data.forEach(x => {
      i++;
      frontLeft += Number(x.frontLeft);
      frontRight += Number(x.frontRight);
      backRight += Number(x.backRight);
      backLeft += Number(x.backLeft);
      temperature += Number(x.temperature);
    });
    return {
      count: i,
      frontLeft: frontLeft / i,
      frontRight: frontRight / i,
      backRight: backRight / i,
      backLeft: backLeft / i,
      weigth: (frontRight + frontLeft + backLeft + backRight) / i,
      temperature: temperature / i,
    }
  }
}
