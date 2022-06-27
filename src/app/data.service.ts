import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //baseUrl = 'https://bandit-task-api.herokuapp.com';
  baseUrl = 'http://localhost:5000'

  constructor(private _http: HttpClient) { }

  getGameStaticTemplate(templatetype:string){
    return this._http.get<any>(this.baseUrl + '/StaticGameTemplate/getTemplate/'+templatetype);
  }

  postUserGameData(userGameData:any){
    return this._http.post(this.baseUrl + '/UserGameRecordData/insert_user_game_data',userGameData);
  }

  getUserId(){
    return this._http.get<any>(this.baseUrl + '/BaseAppData/createuserid');
  }

  postUserConsentData(userConsentData:any){
    return this._http.post(this.baseUrl + '/BaseAppData/record_consent_data',userConsentData);
  }
}
