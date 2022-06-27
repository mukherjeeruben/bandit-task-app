import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameplayComponent } from './gameplay/gameplay.component';
import { InformationComponent } from './information/information.component';
import { GameplayVoiceSynthesizeComponent } from './gameplay-voice-synthesize/gameplay-voice-synthesize.component';
import { RawVoiceComponent } from './voice-record-raw/voice-record-raw.component';
import { PlainLangStatementComponent } from './plain-lang-statement/plain-lang-statement.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'conventional-task', component: GameplayComponent},
  {path: 'information', component: InformationComponent},
  {path: 'voice-task', component: GameplayVoiceSynthesizeComponent},
  {path: 'raw-voice-record', component: RawVoiceComponent},
  {path: 'plain-lang-statement', component: PlainLangStatementComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [GameplayComponent, InformationComponent, GameplayVoiceSynthesizeComponent, RawVoiceComponent, PlainLangStatementComponent, HomeComponent]
