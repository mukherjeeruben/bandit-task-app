import { Component, OnInit } from '@angular/core';
import { IGameData } from '../data.model';
import { DataService } from '../data.service';
import { VoiceTextService } from './voice-text.service';


@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss'],
  providers: [VoiceTextService]
  
})
export class GameplayComponent implements OnInit {
  totalReward = 1000;
  currentResponseIndex=0;
  currentResponse=0;
  staticGameTemplate$: any;
  successResponse$:any;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, public voiceTextService : VoiceTextService) {
    this.voiceTextService.init();
   }

public async loadNextIteration(responseIndex: number, selection: string)
{
    if(this.staticGameTemplate$[0][this.currentResponseIndex]!=null)
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
        data =>{ this.successResponse$ = data;}
      )
      debugger;
      if(this.successResponse$ == true){
        console.log('Data Inserted')
      }
    }
}

ngOnInit() {
  return this.dataService.getGameStaticTemplate()
  .subscribe(data => {
    this.staticGameTemplate$ = data
  });
}

startService(){
  this.voiceTextService.start()
}

stopService(){
  this.voiceTextService.stop()
}
}
