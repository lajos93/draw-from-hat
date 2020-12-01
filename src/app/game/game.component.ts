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
  currentID = null;
  tempStorage = {};

  name = '';
  serverName = '';
  users = [];

  loading = false;
  error = false;



  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private request: HttpService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {

    //Page ID
    this.currentID = this.route.snapshot.params['id'];

    //Data object
    this.sharedDataService.currentMessage
    .subscribe(
      object => (
        this.tempStorage= JSON.parse(object)
    )); 

  this.users = this.tempStorage['servers'][this.currentID]['users'];
  this.serverName = this.tempStorage['servers'][this.currentID]['name'];

  this.name=this.tempStorage['name'];
  }

  joinServer(){
    this.request.joinServer(this.name,this.serverName)
    .subscribe(
      data => {
        // Handle result
        console.log(data);
      },
      error => {
        this.error = error;
        console.log(error);
      },
      () => {
        this.loading = false;
        //this.router.navigate(['/games']);
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );
  }

}
