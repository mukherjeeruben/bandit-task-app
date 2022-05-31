import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanditBlueComponent } from './bandit-blue.component';

describe('BanditBlueComponent', () => {
  let component: BanditBlueComponent;
  let fixture: ComponentFixture<BanditBlueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanditBlueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanditBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
