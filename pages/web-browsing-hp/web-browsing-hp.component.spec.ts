import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebBrowsingHPComponent } from './web-browsing-hp.component';

describe('WebBrowsingHPComponent', () => {
  let component: WebBrowsingHPComponent;
  let fixture: ComponentFixture<WebBrowsingHPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebBrowsingHPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebBrowsingHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
