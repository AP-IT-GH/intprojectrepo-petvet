import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from "src/app/shared/services/auth.service";
import { DataService } from 'src/app/shared/services/data.service';
import { animate, state, style, transition, trigger } from '@angular/animations'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCalendarCellCssClasses} from '@angular/material/datepicker';





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

  public testChart: Object[];
  public xAxis: Object;
  public yAxis1: Object;
  public yAxis2: Object;
  public legend: Object;
  public markerSettings: Object;
  public tooltipSettings: Object;
  public zoom: Object;

  //datapicker 
  // dateClass = (d: Date): MatCalendarCellCssClasses => {
  //   const date = d.getDate();
  //   this.fullPet;
  //   // Highlight the 1st and 20th day of each month.
  //   return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
  // }
  dateClassfunc(pet, i){
    pet.forEach(x => {
      console.log(i, x.date)
    });
    (d: Date) => {
      const date = d.getDate();
      // Highlight the 1st and 20th day of each month.
      return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    }
  }

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


    //getData
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

    this.data.getPetData(this.ownerId).subscribe(pet => {
      this.pets = pet
      this.boolPets = false;
      this.pets.forEach((x, index) => {
        this.fullPet.push(x)
        this.data.getFullPetData(x.petId).subscribe((petdata) => {
          this.fullPet[index].petData = [];
          this.petDatas = [];
          this.petDatas = petdata;
          this.petDatas.forEach(y => {
            this.fullPet[index].petData.push(y)
          });
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
  delete(pet, index) {
    console.log(pet, index)
  }
  onChangePet(value) {
    this.chosenVet = "";
    this.chosenVet = value;
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
    console.log(data, pet, index);
    this.delpostvalue = data;
    const dialogRef = this.dialog.open(DialogDel, {
      width: '300px',
      data: { vetId: this.vetId, petNameret: this.petName, delpostvalue: this.delpostvalue, petName: pet.name, vets: this.vetpet },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result: ", result, ",data:", data)


      if (result && data == 1) {
        this.deletepet(pet, index)
      } else if (result && data == 2) {
        console.log("update", pet)

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
      console.log(postpet)
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
    // this.fullPet[index]= null;
    // location.reload();
  }

  openDialogPost(pet, index): void {
    console.log("post", pet, index)
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
    console.log(this.data)
    this.dialogRef.close(false);
  }
  onYesClick(id): void {
    console.log(id)
    console.log(this.petName, this.data.vetId)
    // if( id == 1)
    //   this.dialogRef.close( this.data);

    if (this.data.petNameret == undefined && this.data.vetId == undefined && id == 2)
      window.alert("no name or vet selected")
    else
      this.dialogRef.close(this.data);
  }
  onChangePet(id) {
    this.data.vetId = id
  }
  dateClass(index){

  }
}






interface petArray {
  uuid: string,
  petId: number,
  name: string,
  vet_uuid: string,
  petData: Arraypet[]
}
interface Arraypet {
  date,
  frontRight,
  frontLeft,
  backRight,
  backLeft,
  petId,
  dataId,
  temperature,
}


