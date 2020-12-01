import { Component, OnInit } from '@angular/core';

import { SharedDataService } from '../_services/_sharedData/shared-data.service'

import { HttpService } from '../_services/http.service'
import { Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  error = '';
  loading = false;
  submitted = false;
  games = {}

  tempStorage = {}
  

  constructor(
    private request:HttpService,
    public router: Router,
    public route: ActivatedRoute,
    private sharedDataService: SharedDataService,
  ) { }

  

  ngOnInit(): void {

    this.sharedDataService.currentMessage


    this.request.getServers()
      .subscribe(
        data => {
          // Save data to the temp storage object
          
          this.games = data;
          this.tempStorage['servers']=data;
          let storageJson = this.tempStorage;

          this.sharedDataService.changeMessage(JSON.stringify(storageJson));
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
      console.log('GAMES',this.tempStorage);
  }

  returnZero() {
    return 0
    }

    openGame(i){
      this.router.navigate(['/games/' + i]);
  }



}
