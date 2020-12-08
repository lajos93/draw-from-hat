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

  ngOnInit() {

    //Server data
    this.sharedDataService.currentMessage.subscribe(message=>this.gameData = message);
    
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state));
    this.server = window.history.state;
    this.i = this.server['i'];

      this.loginForm = this.formBuilder.group({
          name: ['', Validators.required],
      });
  }


  get f() { return this.loginForm.controls; }


  register() {

    this.submitted = true;

    // stop here if form is invalid
    this.loading = true;
    if(this.server){
      this.request.joinServer(this.f.name.value,this.server['server'])
      .subscribe(
        data => {
          this.gameData[this.i] = data;
          this.sharedDataService.changeMessage(this.gameData);       
        },
        error => {
          this.error = error;
          console.log(error);
        },
        () => {
          this.loading = false;
          this._location.back();
        }
          );
        }
  }
}
