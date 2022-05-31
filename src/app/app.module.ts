import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBackgroundComponent } from './game-background/game-background.component';
import { BanditBlueComponent } from './bandit-blue/bandit-blue.component';
import { BanditRedComponent } from './bandit-red/bandit-red.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBackgroundComponent,
    BanditBlueComponent,
    BanditRedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [GameBackgroundComponent]
})
export class AppModule { }
