import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { RawVoiceComponent } from './voice-record-raw/voice-record-raw.component';
import { RawAudioRecordingService } from './voice-record-raw/raw-audio-recording.service';
import { GameplayComponent } from './gameplay/gameplay.component';
import { VoiceTextService } from './gameplay-voice-synthesize/voice-text.service';




@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    RawVoiceComponent,
    GameplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DataService, RawAudioRecordingService, VoiceTextService],
  bootstrap: [AppComponent]
})
export class AppModule { }
