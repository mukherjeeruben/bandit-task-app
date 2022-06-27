import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plain-lang-statement',
  templateUrl: './plain-lang-statement.component.html',
  styleUrls: ['./plain-lang-statement.component.scss']
})
export class PlainLangStatementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public goToICF(){
    this.router.navigate(['/information']);
  }

}
