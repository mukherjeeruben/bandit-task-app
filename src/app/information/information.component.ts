import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  public enableButton: boolean;
  genderList: any = ['Male', 'Female', 'Others'];
  selectedGender:string = '';
  selectedAge:number=0;
  
  constructor(private dataService:DataService, private router: Router) {
    this.enableButton = false;
    }

  processInformation(form: NgForm) {
     let information_data = {
      'I understand all of the details outlined in the Plain Language Statement' : form.controls['response1'].value,
      'I understand that participation in this study is completely voluntary and I am under no obligation to participate in this study':form.controls['response2'].value,
      'I understand that I have the right to withdraw from this study at any time and I do not need to provide an explanation for doing so': form.controls['response3'].value,
      'I understand that information is being obtained for the purpose of a learning activity for the MSc programme in Artificial Intelligence and the data collected may be published' : form.controls['response4'].value,
      'I am aware that I can also withdraw my data from the study should I feel the need to do so, until the point of submission': form.controls['response5'].value,
      'I understand that all of the data collected will be kept confidential': form.controls['response6'].value,
      'I understand that no identifying information will be collected in the course of the study': form.controls['response7'].value,
      'I understand that I can contact any of the researchers listed above should I require any further information': form.controls['response8'].value,
      'I am over the age of 18': form.controls['response9'].value,
      'I consent to taking part in this study': form.controls['response10'].value
    }
    let recorded_data = {user_id : sessionStorage.getItem('UserId'),
                         consent_data:  information_data,
                         gender: form.controls['gender'].value,
                         age:form.controls['age'].value};

    console.log(recorded_data)
    this.dataService.postUserConsentData(recorded_data).subscribe();
    this.loadNextRoute();
 }

 public checkform(){
  // let button = document.getElementById("submit") as HTMLButtonElement | null;

  let nbr_of_checked_no = document.querySelectorAll('input[type=radio][value=no]:checked').length;
  let nbr_checked_radios = document.querySelectorAll('input[type=radio]:checked').length;
    if (nbr_of_checked_no>0 || nbr_checked_radios<10) {
      // button.disabled = true;
      this.enableButton = false;
    } else {
      if(this.selectedGender!='' && this.selectedAge >= 18)
      this.enableButton = true;
      // button.disabled = false ;
    }
  
 }

 public loadNextRoute(){
  let nextRoute = localStorage.getItem('loadNext');
  let gameRoutes = JSON.parse(localStorage.getItem('components')|| '{}');

  const index = gameRoutes.indexOf(nextRoute, 0);
  if (index > -1) {
    gameRoutes.splice(index, 1);
  }

  localStorage.setItem('loadNext', gameRoutes[0]);
  this.router.navigate([nextRoute]);
 }

}
