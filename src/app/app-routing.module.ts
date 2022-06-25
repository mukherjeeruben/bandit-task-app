import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameplayComponent } from './gameplay/gameplay.component';
import { InformationComponent } from './information/information.component';
import { SurveyComponent } from './survey/survey.component';
import { GameplayVoiceSynthesizeComponent } from './gameplay-voice-synthesize/gameplay-voice-synthesize.component';

const routes: Routes = [
  {path: 'conventional-task', component: GameplayComponent},
  {path: 'information', component: InformationComponent},
  {path: 'survey', component: SurveyComponent},
  {path: 'voice-task', component: GameplayVoiceSynthesizeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [GameplayComponent, InformationComponent, SurveyComponent, GameplayVoiceSynthesizeComponent]
