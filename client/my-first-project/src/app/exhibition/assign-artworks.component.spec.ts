import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignArtworksComponent } from './assign-artworks.component';

describe('AssignArtworksComponent', () => {
  let component: AssignArtworksComponent;
  let fixture: ComponentFixture<AssignArtworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignArtworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignArtworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
