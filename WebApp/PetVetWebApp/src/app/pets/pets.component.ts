import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "src/app/shared/services/auth.service";
import { DataService, pet } from 'src/app/shared/services/data.service';
import flatpickr from "flatpickr";
import { animate, state, style, transition, trigger } from '@angular/animations'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PetsComponent implements OnInit {

  formControlName = "set a date"
  randomDateString = '2020-03-30';
  randomDateObject = new Date(1234567891011);
  TestData: any = [{
    uuid: "Kh9WayoF9CWk3ICkZHn1GtNW0Ny2",
    petId: 10,
    name: "pet1",
    vet_uuid: "wleDpFSoL5dEcY9KJLuhrLpyeN13",
    petData: [{
      date: "2020-04-02T00:00:00.000Z",
      frontRight: "1.55",
      frontLeft: "1.55",
      backRight: "0.51",
      backLeft: "0.5",
      petId: 10,
      dataId: 6,
      temperature: 37.1,
    },
    {
      date: "2020-04-03T00:00:00.000Z",
      frontRight: "1.50",
      frontLeft: "1.60",
      backRight: "0.41",
      backLeft: "0.65",
      petId: 10,
      dataId: 7,
      temperature: 36.4,
    },
    {
      date: "2020-04-04T00:00:00.000Z",
      frontRight: "1.55",
      frontLeft: "1.55",
      backRight: "0.51",
      backLeft: "0.5",
      petId: 10,
      dataId: 8,
      temperature: 37.1,
    },
    {
      date: "2020-04-05T00:00:00.000Z",
      frontRight: "1.50",
      frontLeft: "1.60",
      backRight: "0.41",
      backLeft: "0.65",
      petId: 10,
      dataId: 9,
      temperature: 36.4,
    }, {
      date: "2020-04-06T00:00:00.000Z",
      frontRight: "1.55",
      frontLeft: "1.55",
      backRight: "0.51",
      backLeft: "0.5",
      petId: 10,
      dataId: 10,
      temperature: 37.1,
    },
    {
      date: "2020-04-07T00:00:00.000Z",
      frontRight: "1.50",
      frontLeft: "1.60",
      backRight: "0.41",
      backLeft: "0.65",
      petId: 10,
      dataId: 11,
      temperature: 36.4,
    }, {
      date: "2020-04-08T00:00:00.000Z",
      frontRight: "1.55",
      frontLeft: "1.55",
      backRight: "0.51",
      backLeft: "0.5",
      petId: 10,
      dataId: 12,
      temperature: 37.1,
    },
    {
      date: "2020-04-09T00:00:00.000Z",
      frontRight: "1.50",
      frontLeft: "1.60",
      backRight: "0.41",
      backLeft: "0.65",
      petId: 10,
      dataId: 9,
      temperature: 36.4,
    },
    ]
  },
  {
    uuid: "Kh9WayoF9CWk3ICkZHn1GtNW0Ny2",
    petId: 11,
    name: "pet2",
    vet_uuid: null,
    petData: [
      {
        date: "2020-03-29T00:00:00.000Z",
        frontRight: "1",
        frontLeft: "1.1",
        backRight: "0.3",
        backLeft: "0.34",
        petId: 11,
        dataId: 9,
        temperature: 35,
      }
    ]
  }, {
    uuid: "Kh9WayoF9CWk3ICkZHn1GtNW0Ny2",
    petId: 12,
    name: "pet3",
    vet_uuid: null,
    petData: [{
      date: "2020-03-29T00:00:00.000Z",
      frontRight: "1.53",
      frontLeft: "1.62",
      backRight: "0.71",
      backLeft: "0.60",
      petId: 12,
      dataId: 8,
      temperature: 36,
    },
    ]
  }

  ];

  public selectedValue;
  pets: any = [];
  petDatas: any = [];
  fullPet: petArray[];
  ownerId: string

  public testChart: Object[];
  public xAxis: Object;
  public yAxis: Object;
  public legend: Object;
  public markerSettings: Object;
  public tooltipSettings: Object;

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
      valueType: 'Category'
    }
    this.yAxis = {
      title: 'Weight'
    }
    this.legend = {
      visible: true
    };

    var Obj = {              
      arrayOne: [], 
      arrayTwo: [] 
  }; 
    
  // Array to be inserted 
  var arraynew = ['Geeks', 'for', 'Geeks']; 
  // Push an array to object 
  Obj.arrayOne.push(arraynew); 

  var arraynew = ['Hello', 'World', '!!!'];  
// Pushing of array into arrayTwo 
Obj['arrayTwo'].push(arraynew); 
  console.log(Obj)

//getData
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

    this.data.getPetData(this.ownerId).subscribe(pet => {
      this.pets = pet
      console.log(this.pets)
      this.pets.forEach(  (x, index) => { 
        this.data.getFullPetData(x.petId).subscribe( (petdata:any[]) => {
          
          this.fullPet.push(this.pets[index])
          console.log(this.pets[index])
          petdata.forEach(y => {
            // this.fullPet.push()
          });

          // petdata.forEach(y => {
          //   fullPet.push(index,y)
          // });
          // console.log("pets", fullPet)
          // this.pets[index] = {
          //   PetData: [petdata]
          // }

        })
      });
      
      console.log(this.pets)
    })
    
  }

  // getvet(id) {
  //   var vetpet = [];
  //   vetpet = this.pets.filter(x => x.petId == id)
  //   var vet = vetpet[0].vet_uuid;
  // }

  // value: string
  // onEnter(value: string, ) {
  //   this.value = value

  //   this.data.postPetData(this.ownerId, value).subscribe(
  //     (pet: pet) => {
  //       this.pets.push(pet)
  //     },
  //     (error: any) => console.log(error)
  //   )
  //   this.value = "";
  // }


  ngOnInit() {
    console.log(this.TestData)
  }

  @Input() options: Array<Object>;

}

interface petArray{
  uuid:string, 
  petId:number,
  name:string,
  vet_uuid:string,
  petData:any[]
}