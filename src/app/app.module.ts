import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { RawVoiceComponent } from './voice-record-raw/voice-record-raw.component';
import { RawAudioRecordingService } from './voice-record-raw/raw-audio-recording.service';
import { PageBaseComponent } from './page-base/page-base.component';
import { GameplayComponent } from './gameplay/gameplay.component';
import { VoiceTextService } from './gameplay/voice-text.service';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    RawVoiceComponent,
    PageBaseComponent,
    GameplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DataService, RawAudioRecordingService, VoiceTextService],
  bootstrap: [AppComponent]
})
export class AppModule { }
