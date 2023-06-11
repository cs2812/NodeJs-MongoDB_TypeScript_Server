import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class userServiceData {
  
  constructor(private http: HttpClient) {}
  getdata() {
    return this.http.get(
      'https://uat.utopiatech.in:4520/panel/gettestlist?org_id=3'
    );
  }

}
