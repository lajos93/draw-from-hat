import { Component, OnInit } from '@angular/core';

import { SharedDataService } from '../_services/_sharedData/shared-data.service'

import { HttpService } from '../_services/http.service'
import { Router } from '@angular/router'; 
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  error = '';
  loading = false;
  submitted = false;
  games = {}

  message:string;

  tempStorage = {}
  

  constructor(
    private request:HttpService,
    public router: Router,
    public route: ActivatedRoute,
    private sharedDataService: SharedDataService,
  ) { }

  

  ngOnInit(): void {

    this.request.getServers()
      .subscribe(
        data => {

          this.sharedDataService.changeMessage(this.sharedDataService.prepareData(data,"quantify"));
          this.games = data;

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

  returnZero() {
    return 0
    }

    openGame(i){
      this.router.navigate(['/games/' + i], { state: {i:i} } );
  }



}
