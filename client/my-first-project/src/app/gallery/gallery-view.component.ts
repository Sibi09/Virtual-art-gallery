import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ArtworkService } from '../shared/services/artwork.service';
import { Artwork } from '../shared/model/Artwork';
import { HttpClient, } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-gallery-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.scss']
})
export class GalleryViewComponent implements OnInit {
  artworks: Artwork[] = [];
  loading = true;
  message: string | null = null;
  private apiUrl = 'http://localhost:5000/app/artworks';

  constructor(
    private artworkService: ArtworkService,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks(): void {
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

  buyNow(artworkId: string | undefined): void {
    if (!artworkId) {
      this.message = 'Hiányzó műalkotás azonosító.';
      return;
    }

    this.http.post(`${this.apiUrl}/${artworkId}/purchase`, {}, {
  withCredentials: true
}).subscribe({
  next: () => {
    this.message = '✅ Vásárlás sikeres!';
    this.loadArtworks();
  },
  error: (err) => {
    this.message = err.error?.message || '❌ Vásárlás sikertelen.';
  }
});
  }
  
}
