import { Component, OnInit } from '@angular/core';
import { IGameData } from '../data.model';
import { DataService } from '../data.service';


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

  medium_type: string = '';
  iter_index:number = 0;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService) {
    this.templateLength = 0;
    this.eventListn='';
   }

public loadNextIteration(responseIndex: number, selection: string)
{
    if(this.currentResponseIndex < this.templateLength - 1)
    {
      let reward = 0;
      if(selection == 'blue'){
        reward = this.staticGameTemplate$[0][this.currentResponseIndex]['blue'];
      }
      else{
        reward = this.staticGameTemplate$[0][this.currentResponseIndex]['red'];
      }
        this.totalReward = this.totalReward + reward;
        this.userGameData[this.currentResponseIndex] = {
          action: selection,
          reward: reward,
          total_score: this.totalReward
        };
      this.currentResponseIndex = responseIndex + 1;
    }
    else
    {
      this.dataService.postUserGameData(this.userGameData).subscribe(
        data =>{ this.successResponse$ = data;
          console.log('Data Saved Successfully');}
      )
      if(this.successResponse$ == true){
        this.eventListn = 'Thanks for Playing !';
      }
      this.eventListn = 'Thanks for Playing !';
    }
}

getGameTemplate(){
  return this.dataService.getGameStaticTemplate().subscribe(data => {
    this.staticGameTemplate$ = data;
    this.templateLength = Object.keys(this.staticGameTemplate$[0]).length;
  });
}

ngOnInit() {
  this.getGameTemplate();
}

}
