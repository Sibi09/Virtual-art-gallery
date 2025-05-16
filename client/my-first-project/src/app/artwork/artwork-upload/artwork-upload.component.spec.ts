import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkUploadComponent } from './artwork-upload.component';

describe('ArtworkUploadComponent', () => {
  let component: ArtworkUploadComponent;
  let fixture: ComponentFixture<ArtworkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtworkUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtworkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
