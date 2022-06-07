import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { RawVoiceComponent } from './voice-record-raw/voice-record-raw.component';
import { RawAudioRecordingService } from './voice-record-raw/raw-audio-recording.service';
import { PageBaseComponent } from './page-base/page-base.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    RawVoiceComponent,
    PageBaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [RawAudioRecordingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
