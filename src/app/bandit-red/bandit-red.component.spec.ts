import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanditRedComponent } from './bandit-red.component';

describe('BanditRedComponent', () => {
  let component: BanditRedComponent;
  let fixture: ComponentFixture<BanditRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanditRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanditRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
