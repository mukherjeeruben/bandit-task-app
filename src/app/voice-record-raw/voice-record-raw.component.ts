import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RawAudioRecordingService } from './raw-audio-recording.service';

@Component({
  selector: 'app-raw-voice',
  templateUrl: './voice-record-raw.component.html',
  styleUrls: ['./voice-record-raw.component.scss']
})
export class VoiceTextComponent implements OnDestroy {
  audioRecordedTime: any;
  audioBlob: any;
  audioName: any;
  audioStream: any;
  audioBlobUrl: any;
  isAudioRecording = false;
  audioConf = { audio: true}

  constructor(private rawaudioRecordingService: RawAudioRecordingService, private ref: ChangeDetectorRef,private sanitizer: DomSanitizer) 
  { 
    this.rawaudioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
 });

    this.rawaudioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.rawaudioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }

  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.rawaudioRecordingService.startRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.rawaudioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.rawaudioRecordingService.abortRecording();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

}
