import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkSearchComponent} from './mark-search.component';

describe('MarkSearchComponent', () => {
  let component: MarkSearchComponent;
  let fixture: ComponentFixture<MarkSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarkSearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MarkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
