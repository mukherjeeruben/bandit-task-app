import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { VoiceTextComponent } from './voice-record-raw/voice-record-raw.component';
import { RawAudioRecordingService } from './voice-record-raw/raw-audio-recording.service';


@NgModule({
  declarations: [
    AppComponent,
    GameBackgroundComponent,
    VoiceTextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [RawAudioRecordingService],
  // bootstrap: [VoiceTextComponent]
  bootstrap: [GameBackgroundComponent]
})
export class AppModule { }
