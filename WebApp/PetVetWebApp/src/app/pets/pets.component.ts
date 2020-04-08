import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "src/app/shared/services/auth.service";
import { DataService, pet } from 'src/app/shared/services/data.service';
import flatpickr from "flatpickr";
import { animate, state, style, transition, trigger } from '@angular/animations'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatCalendarCellCssClasses } from '@angular/material/datepicker';





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

  public selectedValue;
  pets: any = [];
  tempPet: any = [];
  petDatas: any = [];
  fullPet: petArray[];
  ownerId: string
  vetpet: any = [];
  chosenVet: any = "";
  postvet: any = [];

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

    //getData
    let owner = localStorage.getItem('user');
    var ownerJson = JSON.parse(owner);
    this.ownerId = ownerJson.uid;

    this.data.getPetData(this.ownerId).subscribe(pet => {
      this.pets = pet
      this.fullPet = [];

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
    })


  }

  post(event, pet, index) {
    if (this.chosenVet == "") {
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


  getvet(id) {

    this.vetpet = this.pets.filter(x => x.petId == id)
    var vet = this.vetpet[0].vet_uuid;
  }

  value: string
  onEnter(value: string, ) {
    this.value = value

    this.data.postPetData(this.ownerId, value).subscribe(
      (pet) => {
        this.tempPet = pet
        this.fullPet.push(this.tempPet)
      },
      (error: any) => console.log(error)
    )
    this.value = "";
  }


  ngOnInit() {
    this.data.getAllvet().subscribe((allvet: any) => {
      allvet.forEach(x => {
        this.vetpet.push(x)
      });
    })
  }

  @Input() options: Array<Object>;

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