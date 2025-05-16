import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitionEditComponent } from './exhibition-edit.component';

describe('ExhibitionEditComponent', () => {
  let component: ExhibitionEditComponent;
  let fixture: ComponentFixture<ExhibitionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitionEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
