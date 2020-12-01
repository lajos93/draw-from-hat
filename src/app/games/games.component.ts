import { Component, OnInit } from '@angular/core';

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

  constructor(
    private request:HttpService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  

  ngOnInit(): void {
    this.request.getServers()
      .subscribe(
        data => {
          // Handle result
          
          this.games = data;
          console.log(this.games);
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

  returnZero() {
    return 0
    }

    openGame(i){
      let data = this.games[i];
      console.log(data);

      this.router.navigate(['/games/' + i], { state: data });

  }



}
