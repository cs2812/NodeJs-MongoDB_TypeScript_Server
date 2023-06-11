import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPopComponent } from './map-pop.component';

describe('MapPopComponent', () => {
  let component: MapPopComponent;
  let fixture: ComponentFixture<MapPopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapPopComponent]
    });
    fixture = TestBed.createComponent(MapPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
