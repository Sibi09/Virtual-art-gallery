import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArtworkService } from '../shared/services/artwork.service';
import { Artwork } from '../shared/model/Artwork';

@Component({
  selector: 'app-gallery-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.scss']
})
export class GalleryViewComponent implements OnInit {
  artworks: Artwork[] = [];
  loading = true;

  constructor(private artworkService: ArtworkService) {}

  ngOnInit(): void {
    this.artworkService.getAvailableArtworks().subscribe({
      next: (data) => {
        this.artworks = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getImageUrl(path: string): string {
    return `http://localhost:5000${path}`;
  }
}
