import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { BanditBlueComponent } from './bandit-blue/bandit-blue.component';
import { BanditRedComponent } from './bandit-red/bandit-red.component';
import { VoiceTextComponent } from './voice-text/voice-text.component';
import { AudioRecordingService } from './voice-text/audio-recording.service';


@NgModule({
  declarations: [
    AppComponent,
    GameBackgroundComponent,
    BanditBlueComponent,
    BanditRedComponent,
    VoiceTextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AudioRecordingService],
  // bootstrap: [VoiceTextComponent]
  bootstrap: [GameBackgroundComponent]
})
export class AppModule { }
