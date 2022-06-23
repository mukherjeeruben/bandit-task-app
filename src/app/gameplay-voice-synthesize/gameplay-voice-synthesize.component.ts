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
  
  public utterance: any;
  public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public voices: SpeechSynthesisVoice[];
  public unrecognized: boolean;

  public initialDesc: string;
  public text_loss: string;
  public text_win: string;
  public text_error: string;
  public successGameEndText: string;
  public querySet: string[];

  public totalReward: number;
  public iter_index:number;
  public voiceSelection:string;

  userGameData: {[iteration_number:number]: IGameData} = {};

  constructor(private dataService:DataService, public voiceTextService : VoiceTextService) {
    this.voiceTextService.init();
    this.utterance = new SpeechSynthesisUtterance();

    this.templateLength = 0;

    this.voices = [];
		this.selectedVoice = null;
		this.selectedRate = 0.9;
    this.voiceSelection ='';
    this.unrecognized = false;
    

    this.totalReward = 100;
    this.iter_index = 0;

    this.initialDesc = `You are walking around in the forest and you have just uncovered a pot of gold with one hundred gold coins in it. 
    Unfortunately, your village is beyond the forest. 
    You have to navigate through a clump of dense bushes to reach home. 
    As you make your way through the forest, you will come upon several junctions.
    At each junction, there will be two leprechauns: blue and red . One of them is good, one of them is bad.
    But you don’t know which one is which. You must make a choice about which one of them to pass by. You should choose carefully, because one of them will steal gold coins from you and run away.
    If you choose to pass by the “thief” leprechaun, you will lose the number of gold coins shown below each.
    If you choose to pass by the other leprechaun, you won’t lose any gold coins.
    The aim of this game is to arrive at your village with as many of your gold coins as possible.
    Say 'Blue' to select Blue leprechaun and 'Red' to select Red leprechaun`;

    this.text_loss = 'Opps! Bad Selection.'

    this.text_win = 'Yay ! Good Selection.'

    this.text_error = `Sorry, I couldn't recognoze your response. Can you please try again`

    this.successGameEndText = `Thank You for playing the game. You response is saved successfully.`

    this.querySet = [`Now you are at another junction what do you select ? blue leprechaun or red leprechaun`,
                    `This junction will take you closer to your destination. Which leprechaun do you select red or the blue leprechaun`,
                    `Here again you come across a crossing, which leprechaun do you select? Red ot the blue one`,
                    `Now which leprechaun do you select?`] 

   };


  public ngOnInit(){
    this.getGameTemplate();
    this.getSpeechVoiceType();
	}


  getGameTemplate(){
    return this.dataService.getGameStaticTemplate().subscribe(data => {
      this.staticGameTemplate$ = data;
      this.templateLength = Object.keys(this.staticGameTemplate$[0]).length;
    });
  }


  // Speech Synthesize Code Block Start//

  public getSpeechVoiceType(){
    this.voices = speechSynthesis.getVoices();
		if ( ! this.voices.length ) {
			speechSynthesis.addEventListener("voiceschanged",() => {
					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = (this.voices[8] || null );});
		}
  }

	public async synthesizeSpeechFromText(text: string) {
		this.utterance.voice = this.selectedVoice;
		this.utterance.rate = this.selectedRate;
    this.utterance.lang= 'en-US';
    this.utterance.text = text;
		window.speechSynthesis.speak(this.utterance);

    return new Promise((resolve) => {
      this.utterance.onend = resolve;
    });
	}

  public async speechResponse(reward:number){
    if(reward < 0){
      await this.synthesizeSpeechFromText(this.text_loss);
    }
    else{
      await this.synthesizeSpeechFromText(this.text_win);
    }
  }

  public async reselectionErrorResponse(){
    await this.synthesizeSpeechFromText(this.text_error);
  }

  public async initDescription(){
    await this.synthesizeSpeechFromText(this.initialDesc);
  }

  public async randomSelectionResponse(){
    const random = Math.floor(Math.random() * this.querySet.length);
    await this.synthesizeSpeechFromText(this.querySet[random]);
  }

  public async onSuccessgameEnd(){
    await this.synthesizeSpeechFromText(this.successGameEndText);
  }

  // Speech Synthesize Code Block End//

  // User Data Record Logic Start //
  public async processRecordedData(){
    let reward = 0;
    let selection = '';
    let bandit_selection : number = this.filterAudioText(this.voiceTextService.text);
    if(bandit_selection == 0 || bandit_selection == 1){
        this.unrecognized = false;
        if(bandit_selection == 1){
          reward = this.staticGameTemplate$[0][this.iter_index]['blue'];
          selection='blue';}
        else {
          reward = this.staticGameTemplate$[0][this.iter_index]['red'];
          selection='red';}
        await this.speechResponse(reward);
        this.totalReward = this.totalReward + reward;
        this.userGameData[this.iter_index] = {
            action: selection,
            reward: reward,
            total_score: this.totalReward
          };
          this.iter_index += 1;
          this.voiceTextService.text='';
      }
      else{
        this.unrecognized = true;
        this.voiceTextService.text=''
        await this.reselectionErrorResponse();
      }
  }
// User Data Record Logic End //


// Game Driving Logic Start //
public async startGame() { 
  while(this.iter_index < this.templateLength - 1)
  {
    if(!this.unrecognized){
      await this.randomSelectionResponse();
      this.voiceTextService.start()
      await new Promise(f => setTimeout(f, 7000));
      this.voiceTextService.stop()
      await this.processRecordedData();
    }
    else{
      this.voiceTextService.start()
      await new Promise(f => setTimeout(f, 7000));
      this.voiceTextService.stop()
      await this.processRecordedData();
    }
    
  }
  if(this.iter_index == this.templateLength - 1){
    this.dataService.postUserGameData(this.userGameData).subscribe(
      data =>{ 
        console.log('Data Inserted Succesfully!');}
    )
    await this.onSuccessgameEnd();
  }
}


public filterAudioText(rawText:string): number{
  let textSet: string[] = [];
  let rawTextSet = rawText.split('.');
  rawTextSet.forEach((element:string) => textSet.push(element.trim().toLowerCase()));
  if(textSet.includes('blue') || 
      textSet.includes('blue leprechaun') || 
      textSet.includes('i select blue leprechaun') || 
      textSet.includes('i select blue')|| 
      textSet.includes('select blue') || 
      textSet.includes('i select blue one') || 
      textSet.includes('i select the blue one') || 
      textSet.includes('select blue one')){
    this.voiceSelection = 'Blue';
    return 1;
  }
  else if(textSet.includes('red')|| 
          textSet.includes('red leprechaun') ||  
          textSet.includes('i select red leprechaun')|| 
          textSet.includes('i select red')|| 
          textSet.includes('select red') || 
          textSet.includes('i select red one') || 
          textSet.includes('i select the red one')|| 
          textSet.includes('select red one')){
    this.voiceSelection = 'Red';
    return 0;
  }
  else{
    return -1
  }
}
// Game Driving Logic End //

}
