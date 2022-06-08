import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss']
})
export class GameplayComponent implements OnInit {
  totalReward = 1000;
  currentResponseIndex=0;
  currentResponse=0;
  staticGameTemplate$: any;

  constructor(private dataService:DataService) { }

 public loadNextIteration(responseIndex: number, selection: string):void
{
    if(this.staticGameTemplate$[0][this.currentResponseIndex]!=null)
    {
      let reward = 0;
      if(selection == 'blue'){
        reward = this.staticGameTemplate$[0][this.currentResponseIndex]['blue']
      }
      else{
        reward = this.staticGameTemplate$[0][this.currentResponseIndex]['red']
      }
      this.totalReward = this.totalReward + reward
      this.currentResponseIndex = responseIndex + 1;
    }
    else
    {
      console.log('End Game')
    }
    

}

ngOnInit() {
  return this.dataService.getGameStaticTemplate()
  .subscribe(data => {
    this.staticGameTemplate$ = data
  });
}


}
