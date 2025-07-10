import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterWrapperComponent } from './search-filter-wrapper.component';

describe('SearchFilterWrapperComponent', () => {
  let component: SearchFilterWrapperComponent;
  let fixture: ComponentFixture<SearchFilterWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
