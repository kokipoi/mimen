import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreaobjPage } from './creaobj.page';

describe('CreaobjPage', () => {
  let component: CreaobjPage;
  let fixture: ComponentFixture<CreaobjPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaobjPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
