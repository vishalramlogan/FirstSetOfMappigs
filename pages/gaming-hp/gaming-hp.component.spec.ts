import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingHPComponent } from './gaming-hp.component';

describe('GamingHPComponent', () => {
  let component: GamingHPComponent;
  let fixture: ComponentFixture<GamingHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamingHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamingHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
