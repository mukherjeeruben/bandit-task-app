import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceTextComponent } from './voice-text.component';

describe('VoiceTextComponent', () => {
  let component: VoiceTextComponent;
  let fixture: ComponentFixture<VoiceTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
