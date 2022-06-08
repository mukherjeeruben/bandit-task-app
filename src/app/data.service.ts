import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GamePlayTemplate } from './data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'https://bandit-task-api.herokuapp.com/StaticGameTemplate/get'

  constructor(private _http: HttpClient) { }

  getGameStaticTemplate(){
    return this._http.get<any>(this.apiUrl);
  }
}
