import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceNbMComponent } from './voice-nb-m.component';

describe('VoiceNbMComponent', () => {
  let component: VoiceNbMComponent;
  let fixture: ComponentFixture<VoiceNbMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceNbMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceNbMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
