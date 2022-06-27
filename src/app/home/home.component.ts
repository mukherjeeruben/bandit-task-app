import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {  
  public userId$ : string;

  constructor(private dataService:DataService, private router: Router) {
    this.userId$ ='';
  }

  ngOnInit() {
    this.getRandomUserId();
  }

  public getRandomUserId(){
    return this.dataService.getUserId().subscribe(data => {
      this.userId$ = data;
    });
  }

  public createUserId() {
    sessionStorage.setItem('UserId', this.userId$);
    this.router.navigate(['/information']);
}
}
