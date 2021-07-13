import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading:boolean = false

  constructor() { }

  showLoading():void{
    this.loading=true
  }
  hideLoading():void{
    this.loading=false
  }
  toggleLoading():void {
    this.loading=!this.loading
  }
}
