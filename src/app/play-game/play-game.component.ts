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
  usersFormatted = [];
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

  pairArray(name,hat){

    hat = this.organizeArray(hat,this.usersFormatted);

    var found = this.checkIfExists(name,hat);

    if(this.checkIfHasPair(found, hat))
        return false;
    
    //identify drawer
    var drawer = hat.find(x => x.name === name);

    //make sure the drawer doesnt draw oneself
    if(!drawer.drawn){
      var drawerState = drawer.drawn;
      drawer.drawn = true;
    }

    //sort hat objs by drawn value
    //count the drawn:true-s
    hat.sort(this.compare)
    const countTrue = hat.filter((obj) => obj.drawn === true).length;

    //the pair - making sure not to draw oneself and only choose from those that havent been drawn yet
    var matchedWith = hat[Math.floor(Math.random() * (hat.length-(countTrue)))]['name'];

    //set original state back ( part of debugging to avoid self drawing)
    drawer.drawn = drawerState;

    //Set matchedWith
    drawer.pair = matchedWith;
    this.matchedWith = matchedWith;
    
    var theMatched = hat.find(y => y.name === matchedWith);
    theMatched['drawn'] = true;

    return [drawer,hat]
  }

  compare(a,b) {
    if ( a.drawn < b.drawn ){
      return -1;
    }
    if ( a.drawn > b.drawn ){
      return 1;
    }
    return 0;
  }

  checkIfExists(name,hat){
    var foundItem;
    var i;
    for (i = 0; i < hat.length; i++) {
      if(hat[i]['name']==name){
            foundItem = name;
      }

    }

    if(!foundItem){
        return false;
    }

    return foundItem;
  }

  checkIfHasPair(foundItem,hat){
    if(hat.find(y => y.name === foundItem))    
      if(hat.find(y => y.name === foundItem).pair!=null)    
        return true;
  }

  organizeArray(original,formatted){
    var i;
    for (i = 0; i < original.length; i++) {
      formatted.push({"name":original[i],"drawn":false,"pair":null});
    }
        return formatted;
  }

  drawCard(){
    var stuff = this.pairArray(this.username,this.users)[0];
    console.log(stuff);
    this.request.drawCard(this.gameData[this.i]['name'],stuff)
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
