import { Component, OnInit } from '@angular/core';
import { IGameData } from '../data.model';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {
  totalReward = 100;
  currentResponseIndex=0;
  staticGameTemplate$: any;
  successResponse$:any;
  templateLength:number;
  eventListn:string;
  templatetype: string;

  medium_type: string = '';
  iter_index:number = 0;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, private router: Router) {
    this.templateLength = 0;
    this.eventListn='';
    this.templatetype = 'conventional'; 
   }

public loadNextIteration(responseIndex: number, selection: string)
{
    if(this.currentResponseIndex < this.templateLength)
    {
      let reward_selection;
      if(selection == 'blue'){
        reward_selection = this.staticGameTemplate$[this.currentResponseIndex]['blue'];
        if(reward_selection == 1){
          this.totalReward = this.totalReward - 1;
          // Opps coins lost
         }
        else if(reward_selection == 0){
          this.totalReward = this.totalReward;
          // coins saved Saved 
         }
      }
      else{
        reward_selection = this.staticGameTemplate$[this.currentResponseIndex]['red'];
        if(reward_selection == 1){
          this.totalReward = this.totalReward - 1;
          // Opps coins lost
         }
        else if(reward_selection == 0){
          this.totalReward = this.totalReward;
          // coins saved Saved 
         }
      }
      
        this.userGameData[this.currentResponseIndex] = {
          action: selection,
          reward: reward_selection,
          total_score: this.totalReward
        };
      this.currentResponseIndex = responseIndex + 1;
    }
    else if(this.currentResponseIndex == this.templateLength)
    {
      const now = new Date();
      let userResponse = {
        interface_type : this.templatetype,
        user_id: sessionStorage.getItem('UserId'),
        game_data : this.userGameData,
        creation_time: now
      };
      this.dataService.postUserGameData(userResponse).subscribe(
        data =>{ this.successResponse$ = data;
          console.log('Data Saved Successfully');
          this.eventListn = 'Thanks for Playing !';}  // TODO check this.successResponse$ not getting assigned 
      )
      this.loadNextRoute();
    }
}

getGameTemplate(){
  return this.dataService.getGameStaticTemplate(this.templatetype).subscribe(data => {
    this.staticGameTemplate$ = data;
    this.templateLength = Object.keys(this.staticGameTemplate$).length;
  });
}

ngOnInit() {
  this.getGameTemplate();
}

public loadNextRoute(){
  if(localStorage.getItem('reroute') == 'true'){
    let nextRoute = localStorage.getItem('loadNext');
    localStorage.setItem('reroute', 'false');
    this.router.navigate([nextRoute]);
  }
  else{
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/home']);
  }
 }

}
