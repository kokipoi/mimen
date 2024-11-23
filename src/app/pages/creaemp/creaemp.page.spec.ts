import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreaempPage } from './creaemp.page';

describe('CreaempPage', () => {
  let component: CreaempPage;
  let fixture: ComponentFixture<CreaempPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaempPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
