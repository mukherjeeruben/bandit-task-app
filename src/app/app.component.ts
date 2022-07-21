import { Component, OnInit} from '@angular/core';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {  

  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.sleepWakeUpServer();
  }

  public sleepWakeUpServer(){
    return this.dataService.getUserId().subscribe();
  }
}
