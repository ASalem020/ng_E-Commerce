import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSlider } from './categories-slider';

describe('CategoriesSlider', () => {
  let component: CategoriesSlider;
  let fixture: ComponentFixture<CategoriesSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
