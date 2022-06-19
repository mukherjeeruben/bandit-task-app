import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gameplay-voice-synthesize',
  templateUrl: './gameplay-voice-synthesize.component.html',
  styleUrls: ['./gameplay-voice-synthesize.component.scss']
})
export class GameplayVoiceSynthesizeComponent implements OnInit {

  public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public text: string;
	public voices: SpeechSynthesisVoice[];
  public textset: string[];

  constructor() {
    this.voices = [];
		this.selectedVoice = null;
		this.selectedRate = 0.9;
		// this.text = `You are walking around in the forest and you have just uncovered a pot of gold with ten thousand gold coins in it. 
    // Unfortunately, your village is beyond the forest. 
    // You have to navigate through a clump of dense bushes to reach home. 
    // As you make your way through the forest, you will come upon several junctions.
    // At each junction, there will be two leprechauns: blue and red.
    // One of them is good, one of them is bad.
    // But you don’t know which one is which.`;

    this.text = ``;

    this.textset = [`You are walking around in the forest and you have just uncovered a pot of gold with ten thousand gold coins in it. 
    Unfortunately, your village is beyond the forest. 
    You have to navigate through a clump of dense bushes to reach home. 
    As you make your way through the forest, you will come upon several junctions.
    At each junction, there will be two leprechauns: blue and red.
    One of them is good, one of them is bad.
    But you don’t know which one is which.`, 

    `You must make a choice about which one of them to pass by. You should choose carefully, because one of them will steal gold coins from you and run away.
    If you choose to pass by the “thief” leprechaun, you will lose the number of gold coins shown below each.
    If you choose to pass by the other leprechaun, you won’t lose any gold coins.
    The aim of this game is to arrive at your village with as many of your gold coins as possible.`]
   }

  public ngOnInit() : void {
		this.voices = speechSynthesis.getVoices();
		if ( ! this.voices.length ) {
			speechSynthesis.addEventListener("voiceschanged",() => {
					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = (this.voices[8] || null );});
		}
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
    utterance.lang= 'en-us';
		speechSynthesis.speak( utterance );
	}


  public dummy(){
    this.textset.forEach(async x => {
      this.text = x
      this.speak();
      await this.delay(10000);
    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
}
