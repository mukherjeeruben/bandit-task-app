import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // baseUrl = 'https://bandit-task-api.herokuapp.com';  // Prod Env API
  baseUrl = 'http://localhost:5000' // Local Env API

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

  saveRawAudioFile(file:any, fileName: string){
    const formData = new FormData();
    formData.append("file", file, fileName);
    return this._http.post(this.baseUrl + '/BucketService/uploadfile', formData)
  }
}
