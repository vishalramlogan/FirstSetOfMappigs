import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceWbEComponent } from './voice-wb-e.component';

describe('VoiceWbEComponent', () => {
  let component: VoiceWbEComponent;
  let fixture: ComponentFixture<VoiceWbEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceWbEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceWbEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
