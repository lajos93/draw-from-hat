import { Component, OnInit, } from '@angular/core';
import { Router,ActivatedRoute,Params} from '@angular/router'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from '../_services/http.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  state$: Observable<object>;
  data = {};
  name = '';
  serverName = '';
  users = [];
  loading = false;
  error = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private request: HttpService
  ) { }

  ngOnInit(): void {
    this.state$ = this.route.paramMap
      .pipe(map(() => window.history.state, ))
  //console.log("params",this.route.params);
//
  //console.log('ddddddddddd',this.state$);
  this.data = window.history.state;

  //this.data = {"users":["userTest","userTest2","userTest3","userTest4","userTest5","user44"],"_id":"5fba989898977315b0dd60f2","name":"serverTest","__v":0};
  this.users = this.data['users'];
  this.serverName = this.data['name'];

  this.name = 'THISISGOOD';

  }

  joinServer(){
    this.request.joinServer('ddddddddddddddd',this.serverName)
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
