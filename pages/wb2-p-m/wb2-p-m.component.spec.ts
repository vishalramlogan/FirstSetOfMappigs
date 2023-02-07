import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WB2PMComponent } from './wb2-p-m.component';

describe('WB2PMComponent', () => {
  let component: WB2PMComponent;
  let fixture: ComponentFixture<WB2PMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WB2PMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WB2PMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
