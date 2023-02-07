import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WBSTEMComponent } from './wbste-m.component';

describe('WBSTEMComponent', () => {
  let component: WBSTEMComponent;
  let fixture: ComponentFixture<WBSTEMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WBSTEMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WBSTEMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
