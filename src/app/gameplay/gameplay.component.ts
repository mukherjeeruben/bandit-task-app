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
  voiceSelection:string;
  end_iter:number;
  interval:any;
  interfaceStartButton:boolean;
  eventListn:string;
  blueBanditselectionToggle: boolean;
  redBanditselectionToggle:boolean;

  medium_type: string = '';
  iter_index:number = 0;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, public voiceTextService : VoiceTextService, private route: ActivatedRoute, private router: Router) {
    this.voiceTextService.init();
    this.templateLength = 0;
    this.interfaceToggle = true;
    this.voiceSelection='';
    this.end_iter=0;
    this.interfaceStartButton=true;
    this.eventListn='';
    this.blueBanditselectionToggle=false;
    this.redBanditselectionToggle=false;
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
      if(this.successResponse$ == true){
        this.eventListn = 'Thanks for Playing !';
      }
    }
}


public loadNextIterationVoice()
{
      if(this.templateLength - 1 == this.iter_index)
        { 
          clearInterval(this.interval);
          this.end_iter += 1;
        }
    let selection = '';
    let bandit_selection : number = this.filterAudioText(this.voiceTextService.text);
    if(bandit_selection == 0 || bandit_selection == 1 || this.end_iter == 1){
      if(this.end_iter != 1)
      // if(this.staticGameTemplate$[0][this.iter_index]!=null)
      {
        let reward = 0;
        if(bandit_selection == 1){
          reward = this.staticGameTemplate$[0][this.iter_index]['blue'];
          selection='blue';
        }
        else if(bandit_selection == 0){
          reward = this.staticGameTemplate$[0][this.iter_index]['red'];
          selection='red';
        }
          this.totalReward = this.totalReward + reward;
          this.userGameData[this.iter_index] = {
            action: selection,
            reward: reward,
            total_score: this.totalReward
          };
          this.iter_index += 1;
      }
    else if(this.end_iter == 1)
      {
        this.dataService.postUserGameData(this.userGameData).subscribe(
          data =>{ this.successResponse$ = data;
            this.stopService();
            this.eventListn = 'Thanks for Playing !';
            this.redBanditselectionToggle=false;
            this.blueBanditselectionToggle=false;
            }
        )
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
      this.router.navigate(['/']);
    }
  });
}

startVoiceGame(){
  this.eventListn = 'Starting... Please Wait.'
  this.interfaceStartButton = false;
  this.iter_index = 0;
    this.interval = setInterval(()=>{ 
        this.stopService();
        this.eventListn = 'Processing...'
        if(this.voiceSelection == 'Blue'){
          this.blueBanditselectionToggle=true;
        }
        if(this.voiceSelection == 'Red'){
          this.redBanditselectionToggle=true;
        }
        if(this.iter_index < this.templateLength - 1)
        { setTimeout(()=>{this.startService();
          this.blueBanditselectionToggle=false;
          this.redBanditselectionToggle=false;},2000); }
        else{
          clearInterval(this.interval);
          this.stopService();
        }
    },5000);

}


startService(){
  this.eventListn = 'Listening...'
  this.voiceTextService.start()
}

stopService(){
  this.eventListn = 'Submitting...'
  this.voiceTextService.stop();
  this.loadNextIterationVoice();
  this.voiceTextService.text='';
}

public filterAudioText(rawText:string): number{
  let textSet: string[] = [];
  let rawTextSet = rawText.split('.');
  rawTextSet.forEach((element:string) => textSet.push(element.trim().toLowerCase()));
  if(textSet.includes('blue') || textSet.includes('blue leprechaun') || textSet.includes('left')){
    this.voiceSelection = 'Blue';
    return 1;
  }
  else if(textSet.includes('red')|| textSet.includes('red leprechaun') || textSet.includes('right')){
    this.voiceSelection = 'Red';
    return 0;
  }
  return -1
}



ngOnDestroy() {
}


}
