import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ArtworkService } from '../shared/services/artwork.service';
import { Artwork } from '../shared/model/Artwork';

@Component({
  selector: 'app-collector-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './collector-gallery.component.html',
  styleUrls: ['./collector-gallery.component.scss']
})
export class CollectorGalleryComponent implements OnInit {
  artworks: Artwork[] = [];
  loading = true;

  constructor(private artworkService: ArtworkService) {}

  ngOnInit(): void {
    this.artworkService.getOwnedArtworks().subscribe({
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
