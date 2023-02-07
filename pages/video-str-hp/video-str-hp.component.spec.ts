import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStrHPComponent } from './video-str-hp.component';

describe('VideoStrHPComponent', () => {
  let component: VideoStrHPComponent;
  let fixture: ComponentFixture<VideoStrHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoStrHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoStrHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
