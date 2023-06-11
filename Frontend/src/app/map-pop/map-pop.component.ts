import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-map-pop',
  templateUrl: './map-pop.component.html',
  styleUrls: ['./map-pop.component.css']
})
export class MapPopComponent implements OnInit {
  singleData={}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.singleData = data
    console.log(this.singleData)
   }
  ngOnInit():void {

  }

}
