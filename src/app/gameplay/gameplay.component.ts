import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  templateLength:number;
  interfaceToggle:boolean;

  medium_type: string = '';
  iter_index:number = 0;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, public voiceTextService : VoiceTextService, private route: ActivatedRoute, private router: Router) {
    this.voiceTextService.init();
    this.templateLength = 0;
    this.interfaceToggle = true;
   }

public loadNextIteration(responseIndex: number, selection: string)
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


public loadNextIterationVoice(responseIndex: number, selection: string)
{
    let bandit_selection : number = this.filterAudioText(selection);
    if(this.staticGameTemplate$[0][this.currentResponseIndex]!=null)
    {
      let reward = 0;
      if(bandit_selection == 1){
        reward = this.staticGameTemplate$[0][this.currentResponseIndex]['blue'];
      }
      else if(bandit_selection == 0){
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

getGameTemplate(){
  return this.dataService.getGameStaticTemplate().subscribe(data => {
    this.staticGameTemplate$ = data;
    this.templateLength = Object.keys(this.staticGameTemplate$[0]).length;
  });
}


ngOnInit() {
  this.getGameTemplate();
  this.route.params.subscribe(params => {
    this.medium_type = params['task-type'];
    if (this.medium_type == 'voice-interface'){
      this.interfaceToggle = false;
    }
    else if(this.medium_type == 'conventional-interface'){
      this.interfaceToggle = true;
    }
    else{
      this.router.navigate(['/information']);
    }
  });
}

delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

startVoiceGame(){
  this.iter_index = 0;
    const interval = setInterval(()=>{
      if(this.templateLength <= this.iter_index)
        { clearInterval(interval);} 
        this.stopService()
        this.iter_index < this.templateLength - 1 && 
        setTimeout(()=>{this.startService();},500)
        this.iter_index += 1;
    },10000);
}


startService(){
  this.voiceTextService.start()
}

stopService(){
  this.voiceTextService.stop();
  this.loadNextIterationVoice(0,this.voiceTextService.text);
}

public filterAudioText(rawText:string): number{
  let textSet: string[] = [];
  let rawTextSet = rawText.split('.');
  rawTextSet.forEach((element:string) => textSet.push(element.trim().toLowerCase()));
  if(textSet.includes('blue') || textSet.includes('blue leprechaun') || textSet.includes('left')){
    return 1;
  }
  else if(textSet.includes('red')|| textSet.includes('red leprechaun') || textSet.includes('right')){
    return 0;
  }
  return -1
}



ngOnDestroy() {
}


}
