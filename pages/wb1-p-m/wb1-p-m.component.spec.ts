import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WB1PMComponent } from './wb1-p-m.component';

describe('WB1PMComponent', () => {
  let component: WB1PMComponent;
  let fixture: ComponentFixture<WB1PMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WB1PMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WB1PMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
