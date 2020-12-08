import { Component, OnInit, } from '@angular/core';
import { Router,ActivatedRoute,Params} from '@angular/router'; 
import { Observable } from 'rxjs';
import { map,pluck } from 'rxjs/operators';

import { SharedDataService } from '../_services/_sharedData/shared-data.service'

import { HttpService } from '../_services/http.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  state$: Observable<object>;
  currentID = null;
  state:string;
  i:number;

  name = null;
  serverName = null;
  users = [];
  message:string;

  loading = false;
  error = false;

  gameData;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private request: HttpService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {

    //Server data
    this.sharedDataService.currentMessage.subscribe(message=>this.gameData = message);
    
      this.state$ = this.route.paramMap
       .pipe(map(() => window.history.state, ))
       this.state = window.history.state;

       if('i' in window.history.state){
        this.i = this.state['i'];
        this.users = this.gameData[this.i]['users'];
        this.serverName = this.gameData[this.i]['name'];
      }
      else{
        this.router.navigate(['/']);
      }
  }

  joinServer(){
    if(this.name){
    this.request.joinServer(this.name,this.serverName)
    .subscribe(
      data => {
      },
      error => {
        this.error = error;
        console.log(error);
      },
      () => {
        this.loading = false;
      }
        );
      }
      else{ 
        this.router.navigate(['/register'], { state: {server:this.serverName, i:this.i} });
      }
    }
}
