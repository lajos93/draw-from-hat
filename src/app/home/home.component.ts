import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { HttpService } from '../_services/http.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  name = null;

  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private request:HttpService,
    private router:Router
    ) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          name: ['', Validators.required],
      });
  }

  get f() { return this.loginForm.controls; }


  register() {
    this.submitted = true;

    // stop here if form is invalid
    this.loading = true;
    this.request.register(this.f.name.value)
      .subscribe(
        data => {
          // Handle result
          console.log(data)
        },
        error => {
          this.error = error;
          console.log(error);
        },
        () => {
          this.loading = false;
          this.router.navigate(['/games']);
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );

  }

}
