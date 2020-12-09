import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router,ActivatedRoute,Params} from '@angular/router'; 
import { Observable } from 'rxjs';
import { map,pluck } from 'rxjs/operators';

import { SharedDataService } from '../_services/_sharedData/shared-data.service'
import { HttpService } from '../_services/http.service'


@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit {
  state$: Observable<object>;
  state:string;
  gameData;

  i:number;
  username:string;
  matchedWith:string;
  users = [];
  result = [];

  timeoutHandler: any;
  name;



  error;
  loading;
  

  constructor(
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private request:HttpService,
    private _location: Location
    ) { }

  ngOnInit(): void {

    //Server data
    this.sharedDataService.currentMessage.subscribe(message=>this.gameData = message);

    //receive data
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state, ))
    this.state = window.history.state;
    console.log('thisstate',this.state)


    if(!this.state['i']){
    //  this.sharedDataService.goBack();
    }

    this.i = this.state['i'];
    this.username = this.state['username']
    this.users = this.gameData[this.i]['users'];
    this.result = this.gameData[this.i]['result'];

  }

  pairArray(a,array,resultArray){
    //Make sure the item exists
    var itemFound;

    for (var i=0; i < array.length; i++) {
        if (array[i] === a) {
            itemFound = array[i];
        }
    }
    if(!itemFound){
         return false;
    }

     //Find a random item except the one provided
    const index = array.indexOf(itemFound);
        if (index > -1) {
          array.splice(index, 1);
        }

    var matchedWith = array[Math.floor(Math.random() * array.length)];

    //Remove the item it just matched with
    const matchedWithIndex = array.indexOf(matchedWith);
    if (matchedWithIndex > -1) {
      array.splice(matchedWithIndex, 1);
    }

    let paired = {}
    paired['original'] = itemFound;
    paired['matchedWith'] = matchedWith;

    //Set matchedWith
    this.matchedWith = matchedWith;

    resultArray.push(paired);
    
    return [paired,resultArray];  
  }

  pairedOnly(a,array,resultArray){
    return this.pairArray(a,array,resultArray)[0];
  }

  drawCard(){
    this.request.drawCard(this.gameData[this.i]['name'],this.pairArray(this.username,this.users,this.result)[0])
    .subscribe(
      data => {
        console.log(data)
        this.gameData[this.i] = data;
        this.gameData[this.i]['username'] = this.username;
        this.sharedDataService.changeMessage(this.gameData);  
      },
      error => {
        this.error = error;
        console.log(error);
      },
      () => {
        this.loading = false;
        //this._location.back();
      }
    );
  }

}
