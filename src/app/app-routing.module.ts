import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameplayComponent } from './gameplay/gameplay.component';
import { InformationComponent } from './information/information.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {path: 'bandit-task', component: GameplayComponent},
  {path: 'information', component: InformationComponent},
  {path: 'survey', component: SurveyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [GameplayComponent, InformationComponent, SurveyComponent]
