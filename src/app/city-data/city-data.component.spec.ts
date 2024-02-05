import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDataComponent } from './city-data.component';

describe('CityDataComponent', () => {
  let component: CityDataComponent;
  let fixture: ComponentFixture<CityDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CityDataComponent]
    });
    fixture = TestBed.createComponent(CityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
