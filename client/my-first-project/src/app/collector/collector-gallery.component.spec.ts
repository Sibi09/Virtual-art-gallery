import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorGalleryComponent } from './collector-gallery.component';

describe('CollectorGalleryComponent', () => {
  let component: CollectorGalleryComponent;
  let fixture: ComponentFixture<CollectorGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectorGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
