import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { VoiceTextComponent } from './voice-record-raw/voice-record-raw.component';
import { RawAudioRecordingService } from './voice-record-raw/raw-audio-recording.service';
import { InformationComponent } from './information/information.component';
import { SurveyComponent } from './survey/survey.component';
import { PageBaseComponent } from './page-base/page-base.component';


@NgModule({
  declarations: [
    AppComponent,
    GameBackgroundComponent,
    VoiceTextComponent,
    InformationComponent,
    SurveyComponent,
    PageBaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [RawAudioRecordingService],
  bootstrap: [PageBaseComponent]
})
export class AppModule { }
