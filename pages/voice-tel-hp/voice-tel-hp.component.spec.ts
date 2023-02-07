import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceTelHPComponent } from './voice-tel-hp.component';

describe('VoiceTelHPComponent', () => {
  let component: VoiceTelHPComponent;
  let fixture: ComponentFixture<VoiceTelHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceTelHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceTelHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
