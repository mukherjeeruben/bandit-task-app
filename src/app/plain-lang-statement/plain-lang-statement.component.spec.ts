import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainLangStatementComponent } from './plain-lang-statement.component';

describe('PlainLangStatementComponent', () => {
  let component: PlainLangStatementComponent;
  let fixture: ComponentFixture<PlainLangStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainLangStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainLangStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
