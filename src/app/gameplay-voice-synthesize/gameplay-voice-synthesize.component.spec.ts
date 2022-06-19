import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameplayVoiceSynthesizeComponent } from './gameplay-voice-synthesize.component';

describe('GameplayVoiceSynthesizeComponent', () => {
  let component: GameplayVoiceSynthesizeComponent;
  let fixture: ComponentFixture<GameplayVoiceSynthesizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameplayVoiceSynthesizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameplayVoiceSynthesizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
