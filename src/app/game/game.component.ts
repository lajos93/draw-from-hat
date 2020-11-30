import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params} from '@angular/router'; 

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  name = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.name = params.username; // same as :username in route
      console.log(this.name);
  });
  }

}
