import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { VoiceTextService } from './gameplay-voice-synthesize/voice-text.service';
import { RawAudioRecordingService } from './gameplay-voice-synthesize/raw-audio-recording.service';




@NgModule({
  declarations: [
    AppComponent,
    routingComponents
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
