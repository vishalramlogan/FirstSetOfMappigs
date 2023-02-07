import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionUserComponent } from './introduction-user.component';

describe('IntroductionUserComponent', () => {
  let component: IntroductionUserComponent;
  let fixture: ComponentFixture<IntroductionUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroductionUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroductionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
