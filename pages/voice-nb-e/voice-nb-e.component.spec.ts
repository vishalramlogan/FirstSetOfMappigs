import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceNbEComponent } from './voice-nb-e.component';

describe('VoiceNbEComponent', () => {
  let component: VoiceNbEComponent;
  let fixture: ComponentFixture<VoiceNbEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceNbEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceNbEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
