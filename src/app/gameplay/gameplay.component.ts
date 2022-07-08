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
  public description :string;
  public totalReward : number;
  public currentResponseIndex: number;
  public staticGameTemplate$: any;
  public successResponse$:any;
  public templateLength:number;
  public eventListn:string;
  public templatetype: string;
  public successDelayTime: number;
  public lossDelayTime: number;

  public displayToggle:boolean;
  public rewardsToggle:boolean;
  public finalSubmit:boolean;
  public templateToggle:boolean;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, private router: Router) {
    this.totalReward = 100
    this.currentResponseIndex=0
    this.templateLength = 0;
    this.eventListn='';
    this.templatetype = 'conventional'; 
    this.successDelayTime = 2;
    this.lossDelayTime = 1.5;

    this.displayToggle=true;
    this.rewardsToggle=true;
    this.finalSubmit=true;
    this.templateToggle=true;

    this.description = `You are walking around in the forest and you have just uncovered a pot of gold with one hundred gold coins in it. 
    Unfortunately, your village is beyond the forest. 
    You have to navigate through a clump of dense bushes to reach home. 
    As you make your way through the forest, you will come upon several junctions.
    At each junction, there will be two leprechauns: blue and red . One of them is good, one of them is bad.
    But you don’t know which one is which. You must make a choice about which one of them to pass by. You should choose carefully, because one of them will steal gold coins from you and run away. Each leprechaun has some probability of stealing your gold coins.
    If you choose to pass by the “thief” leprechaun, you will lose a gold coin.
    If you choose to pass by the other leprechaun, you won’t lose any gold coin.
    The aim of this game is to arrive at your village with as many of your gold coins as possible.
    There will be many junctions like this, one after another. 
    So you need to learn which leprechaun is currently the best one to choose throughout your journey.
    Select 'Blue' to select the Blue leprechaun and 'Red' to select the Red leprechaun`;
   }

public async loadNextIteration(responseIndex: number, selection: string)
{
    if(this.currentResponseIndex < this.templateLength)
    {
      let reward_selection;
      if(selection == 'blue'){
        reward_selection = this.staticGameTemplate$[this.currentResponseIndex]['blue'];
        this.displayToggle=false;
        if(reward_selection == 1){
          this.totalReward = this.totalReward - 1;
          this.rewardsToggle=true;
          await new Promise(f => setTimeout(f, this.lossDelayTime * 1000));
          this.displayToggle=true;
          // Opps coins lost
         }
        else if(reward_selection == 0){
          this.totalReward = this.totalReward;
          this.rewardsToggle=false;
          await new Promise(f => setTimeout(f, this.successDelayTime * 1000));
          this.displayToggle=true;
          // coins saved Saved 
         }
      }
      else{
        reward_selection = this.staticGameTemplate$[this.currentResponseIndex]['red'];
        this.displayToggle=false;
        if(reward_selection == 1){
          this.totalReward = this.totalReward - 1;
          this.rewardsToggle=true;
          await new Promise(f => setTimeout(f, this.lossDelayTime * 1000));
          this.displayToggle=true;
          // Opps coins lost
         }
        else if(reward_selection == 0){
          this.totalReward = this.totalReward;
          this.rewardsToggle=false;
          await new Promise(f => setTimeout(f, this.successDelayTime * 1000));
          this.displayToggle=true;
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
          this.eventListn = 'Thanks for Playing !';
          this.finalSubmit=false;}  // TODO check this.successResponse$ not getting assigned 
      )
      await new Promise(f => setTimeout(f, this.successDelayTime * 1000));
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
 public startGame(){
  this.templateToggle=false;
 }

}
