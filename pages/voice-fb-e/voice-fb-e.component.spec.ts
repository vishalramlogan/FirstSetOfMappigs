import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceFbEComponent } from './voice-fb-e.component';

describe('VoiceFbEComponent', () => {
  let component: VoiceFbEComponent;
  let fixture: ComponentFixture<VoiceFbEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceFbEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceFbEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
