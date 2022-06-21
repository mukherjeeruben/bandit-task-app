import { Component, OnInit } from '@angular/core';
import { IGameData } from '../data.model';
import { DataService } from '../data.service';
import { VoiceTextService } from '../gameplay/voice-text.service';


@Component({
  selector: 'app-gameplay-voice-synthesize',
  templateUrl: './gameplay-voice-synthesize.component.html',
  styleUrls: ['./gameplay-voice-synthesize.component.scss'],
  providers: [VoiceTextService]
})
export class GameplayVoiceSynthesizeComponent implements OnInit {

  staticGameTemplate$: any;
  templateLength:number;
  

  public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public text: string;
	public voices: SpeechSynthesisVoice[];

  public initialDesc: string;
  public query: string;
  public text_loss: string;
  public text_win: string;

  public counter: number;
  public totalReward: number;
  public iter_index:number;
  public end_iter:number;
  public voiceSelection:string;
  interval:any;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, public voiceTextService : VoiceTextService) {
    this.voiceTextService.init();

    this.templateLength = 0;

    this.voices = [];
		this.selectedVoice = null;
		this.selectedRate = 0.9;
    this.counter = 0
    this.voiceSelection ='';
    

    this.totalReward = 1000;
    this.iter_index = 0;
    this.end_iter = 0;

    this.text = ``;

    this.initialDesc = `You are walking around in the forest and you have just uncovered a pot of gold with ten thousand gold coins in it. 
    Unfortunately, your village is beyond the forest. 
    You have to navigate through a clump of dense bushes to reach home. 
    As you make your way through the forest, you will come upon several junctions.
    At each junction, there will be two leprechauns: 'blue' and 'red' . One of them is good, one of them is bad.
    But you don’t know which one is which. You must make a choice about which one of them to pass by. You should choose carefully, because one of them will steal gold coins from you and run away.
    If you choose to pass by the “thief” leprechaun, you will lose the number of gold coins shown below each.
    If you choose to pass by the other leprechaun, you won’t lose any gold coins.
    The aim of this game is to arrive at your village with as many of your gold coins as possible.
    Say 'Blue' to select Blue leprechaun and 'Red' to select Red leprechaun`;

    this.query = `Which leprechaun do you select?`;

    this.text_loss = 'Opps! Bad Selection.'

    this.text_win = 'Yay ! Good Selection.'

   };


  public ngOnInit(){

    this.getGameTemplate();

		this.voices = speechSynthesis.getVoices();
		if ( ! this.voices.length ) {
			speechSynthesis.addEventListener("voiceschanged",() => {
					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = (this.voices[8] || null );});
		}


	}


  getGameTemplate(){
    return this.dataService.getGameStaticTemplate().subscribe(data => {
      this.staticGameTemplate$ = data;
      this.templateLength = Object.keys(this.staticGameTemplate$[0]).length;
    });
  }

	public speak() : void {
		if ( ! this.selectedVoice || ! this.text ) {
			return;}
		this.stop();
		this.synthesizeSpeechFromText(this.text);
	}


	public stop() : void {
		if ( speechSynthesis.speaking ) {
			speechSynthesis.cancel();
		}
	}


	private synthesizeSpeechFromText(text: string) : void {
		var utterance = new SpeechSynthesisUtterance( text );
		utterance.voice = this.selectedVoice;
		utterance.rate = this.selectedRate;
    utterance.lang= 'en-US';
		speechSynthesis.speak( utterance );
	}


  public initDescription(){
    this.text = this.initialDesc;
    this.speak();
  }


  public loadNextIterationVoice()
{
    let selection = '';
    let bandit_selection : number = this.filterAudioText(this.voiceTextService.text);

    if(bandit_selection == 0 || bandit_selection == 1){
      console.log(bandit_selection);
    if(this.end_iter != 1)
      // if(this.staticGameTemplate$[0][this.iter_index]!=null)
      {
        let reward = 0;
        if(bandit_selection == 1){
          reward = this.staticGameTemplate$[0][this.iter_index]['blue'];
          selection='blue';
          this.speechResponse(reward);
        }
        else if(bandit_selection == 0){
          reward = this.staticGameTemplate$[0][this.iter_index]['red'];
          selection='red';
          this.speechResponse(reward);
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
          data =>{ console.log('Data Inserted Succesfully!');}
        )
      }
    }
    
}


startService(){
  this.voiceTextService.start()
}

stopService(){
  this.voiceTextService.stop();
  console.log(this.voiceTextService.text);
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

// public startGame(){
//   this.iter_index = 0;
  
//   this.interval = setInterval(()=>{
//     this.stopService();
//     if(this.iter_index < this.templateLength - 1)
//         { setTimeout(()=>{
//           this.text = this.query;
//           this.speak();
//           this.startService();
//           },2000); 
//         }
//         else
//         {
//           clearInterval(this.interval);
//           this.stopService();
//         }
//   },5000);
// }


public startGame(){
  this.iter_index = 0;

  this.interval = setInterval(()=>{
    console.log(this.iter_index);
    if(this.iter_index < this.templateLength - 1)
    {
      this.text = this.query;
      this.speak();
      setTimeout(()=>{
        this.startService();
        setTimeout(()=>{
          this.stopService(); // TODO Listening Image
        },3000);
      },2000);
    }
  },8000);
}


public speechResponse(reward:number){
  if(reward<0){
    this.text = this.text_loss;
    this.speak();
  }
  else{
    this.text = this.text_win;
    this.speak();
  }

}


  // public async dummy(){
  //   this.textset.forEach(x => {
  //     this.text = x;
  //     this.speak();
  //     if(speechSynthesis.speaking == true){
  //       console.log('Speaking');
  //     }
  //   })
  // }


  // public async dummy(){
  //   for(let i=0; i<2; i++){
  //     this.text = this.textset[i];
  //     this.speak();
  //     debugger;
  //     if(speechSynthesis.speaking){
  //       await this.delay(10000);
  //     }
  //   }
  // }

  


  //   this.textset.forEach(static_text => {
  //     setTimeout(()=>{
  //       this.text = static_text;
        
  //     }, 10000)
  //   })
  // }

  // delay(ms: number) {
  //   return new Promise( resolve => setTimeout(resolve, ms) );
// }
}
