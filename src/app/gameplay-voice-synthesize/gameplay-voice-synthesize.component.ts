import { Component, OnInit } from '@angular/core';
import { IGameData } from '../data.model';
import { DataService } from '../data.service';
import { VoiceTextService } from './voice-text.service';
import { Router } from '@angular/router';
import { RawAudioRecordingService } from './raw-audio-recording.service';


@Component({
  selector: 'app-gameplay-voice-synthesize',
  templateUrl: './gameplay-voice-synthesize.component.html',
  styleUrls: ['./gameplay-voice-synthesize.component.scss'],
  providers: [VoiceTextService, RawAudioRecordingService]
})
export class GameplayVoiceSynthesizeComponent implements OnInit {

  staticGameTemplate$: any;
  templateLength:number;
  public scoreSpeakIter: number;

  public templatetype:string;
  
  public utterance: any;
  public allVoicesObtained: any;
  public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public voices: SpeechSynthesisVoice[];
  public unrecognized: boolean;
  public voicetype:string;

  public initialDesc: string;
  public text_loss: string;
  public text_win: string;
  public text_error: string;
  public successGameEndText: string;
  public firstJunction: string;
  public querySet: string[];

  public totalReward: number;
  public iter_index:number;
  public voiceSelection:string;

  public recordStartSound:any;
  public recordStopSound:any;

  public voiceResponseTime:number;

  userGameData: {[iteration_number:number]: IGameData} = {};

  // Button Toggle variables
  public speechAnimation :boolean;
  public micAnimation: boolean;
  public descriptionButton :boolean;
  public playButton :boolean;
  // Button Toggle variables


  constructor(private dataService:DataService, public voiceTextService : VoiceTextService, private router: Router, private rawaudioRecordingService: RawAudioRecordingService) {
    this.templatetype = 'voice';
    this.voiceTextService.init();
    this.utterance = new SpeechSynthesisUtterance();
    this.scoreSpeakIter = 2; // TODO Score speek number after iteration -> change to 10 in PROD

    this.templateLength = 0;
    this.voiceResponseTime = 5;  // Time in Seconds

    this.voices = [];
		this.selectedVoice = null;
		this.selectedRate = 0.9;
    this.voiceSelection ='';
    this.unrecognized = false;

    this.totalReward = 100;
    this.iter_index = 0;
    this.voicetype = 'Microsoft Emily Online (Natural) - English (Ireland)'

    this.initialDesc = `You are walking around in the forest and you have just uncovered a pot of gold with one hundred gold coins in it. 
    Unfortunately, your village is beyond the forest. 
    You have to navigate through a clump of dense bushes to reach home. 
    As you make your way through the forest, you will come upon several junctions.
    At each junction, there will be two leprechauns: blue and red . One of them is good, one of them is bad.
    But you don’t know which one is which. You must make a choice about which one of them to pass by. You should choose carefully, because one of them will steal gold coins from you and run away.    Each leprechaun has some probability of stealing your gold coins.
    If you choose to pass by the “thief” leprechaun, you will lose a gold coin.
    If you choose to pass by the other leprechaun, you won’t lose any gold coins.
    You need to learn which leprechaun is currently the best one to choose throughout your journey.
    The aim of this game is to arrive at your village with as many of your gold coins as possible.
 
    Say 'Blue' to select Blue leprechaun and 'Red' to select Red leprechaun';

    this.text_loss = 'Oops! you lost a coin'

    this.text_win = 'Yay ! Good choice, you did not loose a coin'

    this.text_error = `Sorry, I couldn't recognoze your response. Can you please try again`

    this.successGameEndText = `Thank You for playing the game. You response is saved successfully.`

    this.querySet = [`Now you are at another junction what do you select ? the blue leprechaun or the red leprechaun`,
                    `This junction will take you closer to your destination. Which leprechaun do you select red or the blue leprechaun`,
                    `Here again you come across a junction, which leprechaun do you select? the Red one or the blue one`,
                    `Now which leprechaun do you select?`]
    
    this.firstJunction = `At your first junction there is a blue leprechaun and a red leprechaun. Which one do you select?`


    this.recordStartSound = new Audio('../../assets/sounds/recordStartSound.wav');
    this.recordStopSound = new Audio('../../assets/sounds/recordStopSound.wav');

    // Button Toggle variables

    this.speechAnimation = false;
    this.micAnimation = false;
    this.descriptionButton = true;   
    this.playButton = false;  

    // Button Toggle variables

   };


  public ngOnInit(){
    this.getGameTemplate();
    this.getSpeechVoiceType();
	}


  getGameTemplate(){
    return this.dataService.getGameStaticTemplate(this.templatetype).subscribe(data => {
      this.staticGameTemplate$ = data;
      this.templateLength = Object.keys(this.staticGameTemplate$).length;
    });
  }


  // Speech Synthesize Code Block Start//


  public getSpeechVoiceType(){
    this.allVoicesObtained = new Promise(function (resolve, reject) {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length !== 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', function () {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        });
      }
    });

    this.allVoicesObtained.then((voices:any) => {
      Object.keys(voices).forEach(key => {
        if (voices[key].name === this.voicetype) {
          this.selectedVoice = voices[key];;
        }
    });
    });
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
    if(reward == 1){
      this.speechAnimation = true;
      await this.synthesizeSpeechFromText(this.text_loss);
      this.speechAnimation = false;
    }
    else if(reward == 0){
      this.speechAnimation = true;
      await this.synthesizeSpeechFromText(this.text_win); 
      this.speechAnimation = false;
    }
  }

  public async reselectionErrorResponse(){
    this.speechAnimation = true;
    await this.synthesizeSpeechFromText(this.text_error);
    this.speechAnimation = false;
  }

  public async initDescription(){
    this.descriptionButton = false;
    this.speechAnimation = true;
    await this.synthesizeSpeechFromText(this.initialDesc);
    this.speechAnimation = false;
    this.playButton = true;
  }

  public async initialSelectionResponse(){
    this.speechAnimation = true;
    await this.synthesizeSpeechFromText(this.firstJunction);
    this.speechAnimation = false;
  }

  public async randomSelectionResponse(){
    const random = Math.floor(Math.random() * this.querySet.length);
    this.speechAnimation = true;
    await this.synthesizeSpeechFromText(this.querySet[random]);
    this.speechAnimation = false;
  }

  public async gameScoreResponse(){
    this.speechAnimation = true;
    let scoreSpeechText = 'You have' + (this.totalReward).toString() + 'coins left'
    await this.synthesizeSpeechFromText(scoreSpeechText);
    this.speechAnimation = false;
  }

  public async onSuccessgameEnd(){
    this.speechAnimation = true;
    await this.synthesizeSpeechFromText(this.successGameEndText);
    this.speechAnimation = false;
  }

  // Speech Synthesize Code Block End//

  // User Data Record Logic Start //
  public async processRecordedData(){
    let reward_selection;
    let selection = '';
    let bandit_selection : number = this.filterAudioText(this.voiceTextService.text);
    if(bandit_selection == 0 || bandit_selection == 1){
        this.unrecognized = false;
        if(bandit_selection == 1){
          reward_selection = this.staticGameTemplate$[this.iter_index]['blue'];
          selection='blue';
          if(reward_selection == 1){
            this.totalReward = this.totalReward - 1;
           }
          else if(reward_selection == 0){
            this.totalReward = this.totalReward;
           }}
        else {
          reward_selection = this.staticGameTemplate$[this.iter_index]['red'];
          selection='red';
          if(reward_selection == 1){
            this.totalReward = this.totalReward - 1;
           }
          else if(reward_selection == 0){
            this.totalReward = this.totalReward;
           }
        }
        await this.speechResponse(reward_selection);
       
        this.userGameData[this.iter_index] = {
            action: selection,
            reward: reward_selection,
            total_score: this.totalReward
          };
          if((this.iter_index + 1) % this.scoreSpeakIter == 0){
            await this.gameScoreResponse();
          }
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
  this.startAudioRecording();
  this.playButton = false;
  while(this.iter_index < this.templateLength)
  {
    if(!this.unrecognized){
      if(this.iter_index==0) {
        await this.initialSelectionResponse();
      }
      else{
        await this.randomSelectionResponse();
      }
      this.recordStartSound.play();
      this.voiceTextService.start();
      this.micAnimation = true;
      await new Promise(f => setTimeout(f, this.voiceResponseTime * 1000));
      this.recordStopSound.play();
      this.voiceTextService.stop();
      this.micAnimation = false;
      await this.processRecordedData();
    }
    else{
      this.recordStartSound.play();
      this.voiceTextService.start();
      this.micAnimation = true;
      await new Promise(f => setTimeout(f, this.voiceResponseTime * 1000));
      this.recordStopSound.play();
      this.voiceTextService.stop();
      this.micAnimation = false;
      await this.processRecordedData();
    }

    console.log('Save data to db');

    if(this.iter_index == this.templateLength - 1){
      this.iter_index += 1;
      const now = new Date();
      let userResponse  = {
          interface_type : this.templatetype,
          user_id: sessionStorage.getItem('UserId'),
          game_data : this.userGameData,
          creation_time: now
        };
      this.dataService.postUserGameData(userResponse).subscribe(
        data =>{ 
          console.log('Data Inserted Succesfully!');}
      )
      this.stopAudioRecording();
      await this.saveAudioRecordedData();
      await this.onSuccessgameEnd();
      this.loadNextRoute();
    }
    
  }
  
}


public filterAudioText(rawText:string): number{
  let textSet: string[] = [];
  let rawTextSet = rawText.split('.');
  rawTextSet.forEach((element:string) => textSet.push(element.trim().toLowerCase()));
  if(textSet.includes('blue') || 
      textSet.includes('blue leprechaun') || 
      textSet.includes('the blue leprechaun') ||
      textSet.includes('i select blue leprechaun') ||
      textSet.includes('i select the blue leprechaun') || 
      textSet.includes('i select blue')|| 
      textSet.includes('select blue') || 
      textSet.includes('i select blue one') || 
      textSet.includes('i select the blue one') || 
      textSet.includes('select blue one')||
      textSet.includes('blue one')||
      textSet.includes('the blue one')){
    this.voiceSelection = 'Blue';
    return 1;
  }
  else if(textSet.includes('red')|| 
          textSet.includes('red leprechaun') || 
          textSet.includes('the red leprechaun') || 
          textSet.includes('i select red leprechaun')||
          textSet.includes('i select the red leprechaun') || 
          textSet.includes('i select red')|| 
          textSet.includes('select red') || 
          textSet.includes('i select red one') || 
          textSet.includes('i select the red one')|| 
          textSet.includes('select red one') ||
          textSet.includes('red one')||
          textSet.includes('the red one')){
    this.voiceSelection = 'Red';
    return 0;
  }
  else{
    return -1
  }
}
// Game Driving Logic End //

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


 // Raw Audio Recording Start 

public startAudioRecording() {
    this.rawaudioRecordingService.startRecording();
}

public stopAudioRecording() {
    this.rawaudioRecordingService.stopRecording();
}

public async saveAudioRecordedData(){
  this.rawaudioRecordingService.getRecordedBlob().subscribe((data) => {
  const fileblob = new Blob([data['blob']], { type: "audio/wav" });
  this.dataService.saveRawAudioFile(fileblob, data['title']).subscribe((event:any) =>{
    console.log('Raw audio file uploaded successfully to bucket')
  });
  });
}

 // Raw Audio Recording Stop

}
