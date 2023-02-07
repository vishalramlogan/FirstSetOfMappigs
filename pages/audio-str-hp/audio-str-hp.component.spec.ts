import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioStrHPComponent } from './audio-str-hp.component';

describe('AudioStrHPComponent', () => {
  let component: AudioStrHPComponent;
  let fixture: ComponentFixture<AudioStrHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioStrHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioStrHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
