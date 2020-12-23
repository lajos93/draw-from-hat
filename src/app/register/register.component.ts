import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map,pluck } from 'rxjs/operators';

import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { HttpService } from '../_services/http.service'
import { SharedDataService } from '../_services/_sharedData/shared-data.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  state$: Observable<object>;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  name = null;
  server = null;
  i:number;
  subPage: boolean = false;

  message:string;

  gameData;

  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private request:HttpService,
    private sharedDataService: SharedDataService,
    private router:Router,
    private route: ActivatedRoute,
    private _location: Location
    ) { }

  isBoolean(val) {
      return val === false || val === true;
   }

  ngOnInit() {

    //Server data
    this.sharedDataService.currentMessage.subscribe(message=>this.gameData = message);

    
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state));
    this.server = window.history.state;
    this.i = this.server['i'];

    //only show if current page is a subpage of another
    this.subPage = typeof(this.i)=='number' ? true : false ;
     
    //if its subpage set the index of the created room/server
    if(!this.subPage){
        this.i = this.gameData.length;
    }

    console.log(this.i);


      this.loginForm = this.formBuilder.group({
          name: ['', Validators.required],
          server:['', Validators.required]
      });

  }


  get f() { return this.loginForm.controls; }


  register() {

    this.submitted = true;

    // stop here if form is invalid
    this.loading = true;

    let serverName;

    //if new server is added take name from the field else take current server's name
    serverName = !this.subPage ? this.f.server.value :  this.server['server'];

      this.request.joinServer(this.f.name.value,serverName)
      .subscribe(
        data => {
          this.gameData[this.i] = data;
          this.gameData[this.i]['username'] = this.f.name.value;
          this.sharedDataService.changeMessage(this.gameData);       
        },
        error => {
          this.error = error;
          console.log(error);
        },
        () => {
          this.loading = false;

          if (!this.subPage)
             this.router.navigate(['/games/' + this.i], { state: {i:this.i} })
          else
            this._location.back();
          
         }
      );
      
  }
}
