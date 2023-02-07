import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTelHPComponent } from './video-tel-hp.component';

describe('VideoTelHPComponent', () => {
  let component: VideoTelHPComponent;
  let fixture: ComponentFixture<VideoTelHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoTelHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoTelHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
