import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { InformationComponent } from './information/information.component';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {path: 'bandit-task', component: GameBackgroundComponent},
  {path: 'information', component: InformationComponent},
  {path: 'survey', component: SurveyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
