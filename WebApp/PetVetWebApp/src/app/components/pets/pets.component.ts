import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from "src/app/shared/services/auth.service";
import { DataService } from 'src/app/shared/services/data.service';
import { animate, state, style, transition, trigger } from '@angular/animations'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { access } from 'fs';





@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PetsComponent implements OnInit {

  //testing
  vetId: string;
  petName: string;
  delpostvalue: number;
  //end testing
  petnameInput = "";
  boolPets = false;

  multi = true;
  public selectedValue;
  pets: any = [];
  tempPet: any = [];
  petDatas: any = [];
  fullPet: petArray[] = [];
  ownerId: string
  vetpet: any = [];
  chosenVet: any = "";
  postvet: any = [];
  last5Temp: any = []

  public testChart: Object[];
  public xAxis: Object;
  public yAxis1: Object;
  public yAxis2: Object;
  public legend: Object;
  public markerSettings: Object;
  public tooltipSettings: Object;
  public zoom: Object;
  frontRighttemp: any;
  frontLefttemp: any;
  backLefttemp: any;
  backRighttemp: any;
  temperaturetemp: any;
  itemp: number;

  constructor(public authService: AuthService,
    private data: DataService,
    public dialog: MatDialog) {
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

    var frontRighttemp;
    var frontLefttemp;
    var backLefttemp;
    var backRighttemp;
    var temperaturetemp;
    var i = 0;
    //getData
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

    this.data.getPetData(this.ownerId).subscribe(pet => {
      this.pets = pet
      this.boolPets = false;
      this.pets.forEach((x, index) => {
        this.fullPet.push(x)
        this.data.getLast5datepets(x.petId).subscribe((last5 => {
          
          this.last5Temp = this.getAverage(last5);
          this.fullPet[index].average5 = this.last5Temp
        }))

        this.data.getFullPetData(x.petId).subscribe((petdata) => {
          this.fullPet[index].petData = [];
          this.petDatas = [];
          this.petDatas = petdata;


          this.petDatas.forEach(y => {
            y.weight = (Number(y.frontRight) + Number(y.frontLeft) + Number(y.backRight) + Number(y.backLeft))
            this.fullPet[index].petData.push(y)
          });
          console.log(this.fullPet)
        }, (error: any) => console.log(error))
      });
    }, (error: any) => {
      this.boolPets = true;
    })

  }

  put(pet, index) {
    if (this.chosenVet == "") {
      window.alert("No Vet Selected!");
    } else {
      this.data.PostPetVet(this.chosenVet, pet.petId, pet.name).subscribe(pet => {
        this.postvet = [];
        this.postvet = pet;
        this.fullPet[index].vet_uuid = this.postvet.vet_uuid
      }, (error: any) => console.log(error))
    }
  }

  onChangePet(value) {
    this.chosenVet = "";
    this.chosenVet = value;
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
      frontLeft: frontLeft/i,
      frontRight: frontRight/i,
      backRight: backRight/i,
      backLeft: backLeft/i,
      weigth:  (frontRight + frontLeft + backLeft + backRight)/i,
      temperature: temperature/i,
    }
  }

  getvet(id) {
    this.vetpet = this.pets.filter(x => x.petId == id)
  }

  regex = "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$";
  onEnter() {
    if (this.petnameInput != "")
      this.data.postPetData(this.ownerId, this.petnameInput).subscribe(
        (pet) => {
          this.tempPet = pet
          this.fullPet.push(this.tempPet)
        },
        (error: any) => console.log(error)
      )
    else
      window.alert("No proper Name")
    this.petnameInput = "";

  }


  ngOnInit() {
    this.data.getAllvet().subscribe((allvet: any) => {
      allvet.forEach(x => {
        this.vetpet.push(x)
      }, (error: any) => console.log(error));
    })
  }

  @Input() options: Array<Object>;

  openDialog(data, pet, index): void {

    this.delpostvalue = data;
    const dialogRef = this.dialog.open(DialogDel, {
      width: '300px',
      data: { vetId: this.vetId, petNameret: this.petName, delpostvalue: this.delpostvalue, petName: pet.name, vets: this.vetpet },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && data == 1) {
        this.deletepet(pet, index)
      } else if (result && data == 2) {
        if (result.vetId == undefined) {
          result.vetId = pet.vet_uuid;
        } else if (result.petNameret == undefined) {
          result.petNameret = pet.name;
        }
        this.PostPet(result.vetId, result.petNameret, pet.petId, index)
      }
    });
  }
  PostPet(vetId, petName, petId, index) {
    this.fullPet[index].name = petName;
    this.fullPet[index].vet_uuid = vetId
    this.data.PostPetVet(vetId, petId, petName).subscribe(postpet => {

    }, error => {
      console.log(error)
    })
  }

  deletepet(pet, index) {
    if (this.fullPet[index].petData != null) {
      this.fullPet[index].petData.forEach(x => {
        this.data.deletePetData(x.dataId).subscribe(er => console.log(er))
      });

      this.fullPet[index].petData = null
    } else {
      console.log("no petdata")
    }
    this.data.deletePet(pet.petId).subscribe(er => console.log(er))
    this.fullPet.splice(index, 1)
  }

  openDialogPost(pet, index): void {
  }
}




@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-del.html',
  styleUrls: ['./pets.component.css'],

})
export class DialogDel {
  DelPostValue;
  petName;
  allVets;
  vet;
  constructor(
    public dialogRef: MatDialogRef<DialogDel>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.DelPostValue = data.delpostvalue;
    this.petName = data.petName;
    this.allVets = data.vets;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onYesClick(id): void {
    if (this.data.petNameret == undefined && this.data.vetId == undefined && id == 2)
      window.alert("no name or vet selected")
    else
      this.dialogRef.close(this.data);
  }
  onChangePet(id) {
    this.data.vetId = id
  }

}






interface petArray {
  uuid: string,
  petId: number,
  name: string,
  vet_uuid: string,
  petData: Arraypet[],
  average5 : any
}
interface Arraypet {
  date: Date,
  weight: number
  frontRight: number,
  frontLeft: number,
  backRight: number,
  backLeft: number,
  petId: number,
  dataId: number,
  temperature: number,
}

// interface last5weight {
//   weight : number
//   frontRight;
//   frontLeft;
//   backRight;
//   backLeft;
//   temperature
// }


