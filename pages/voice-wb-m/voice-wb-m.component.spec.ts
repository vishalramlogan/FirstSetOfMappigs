import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceWbMComponent } from './voice-wb-m.component';

describe('VoiceWbMComponent', () => {
  let component: VoiceWbMComponent;
  let fixture: ComponentFixture<VoiceWbMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceWbMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceWbMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
