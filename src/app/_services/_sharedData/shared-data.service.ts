import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  messageSource = new BehaviorSubject<any>(null);
  currentMessage = this.messageSource.asObservable();
  
  constructor(){

  }

  changeMessage(message: string){
    this.messageSource.next(message);
  }

  prepareData(data,procedure = null){

    if(procedure == 'quantify'){
      for (let i  = 0; i < data.length; i++) {
        data[i]["i"] = i;
      }
    }

    return data;
  }

  retrieveData(data){
    return data;
  }

}
