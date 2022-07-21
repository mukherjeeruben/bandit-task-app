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
    this.setGameplayRoutes();
    localStorage.setItem('UserId', this.userId$);
    this.router.navigate(['/information']);
}

public setGameplayRoutes(){
  const gameComponents = ['/voice-task', '/conventional-task']
  const random = Math.floor(Math.random() * gameComponents.length);
  localStorage.setItem('components', JSON.stringify(gameComponents));
  localStorage.setItem('loadNext', gameComponents[random]);
  localStorage.setItem('reroute', 'true');
}
}
