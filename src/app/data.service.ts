import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GamePlayTemplate } from './data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = 'https://bandit-task-api.herokuapp.com'

  constructor(private _http: HttpClient) { }

  getGameStaticTemplate(){
    return this._http.get<any>(this.baseUrl + '/StaticGameTemplate/get');
  }

  postUserGameData(userGameData:any){
    return this._http.post(this.baseUrl + '/UserGameRecordData/insert_user_game_data',userGameData);
  }
}
