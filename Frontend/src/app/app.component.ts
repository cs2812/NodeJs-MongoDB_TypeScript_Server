import { Component } from '@angular/core';
import { userServiceData } from './userServiceData';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from './pop-up/pop-up.component';
import { MapPopComponent } from './map-pop/map-pop.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  Datatable: any = [];
  singleData:any={};
  map:any={}
  constructor(private data: userServiceData, private dialogRef:MatDialog, private mapdialog:MatDialog) {
    this.data.getdata().subscribe((data: any) => {
      this.Datatable = data?.result;
    });
  }
  openDialog(res:any) {
    this.dialogRef.open(PopUpComponent,{width:"60%", height:"200px",data:res} )
  }
  openMapDialog(res:any){
    this.mapdialog.open(MapPopComponent,{width:"31.5%", height:"540px",data:res})
  }
}

