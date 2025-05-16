import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkService, Artwork } from '../../shared/services/artwork.service';
import { AuthService, User } from '../../shared/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './artwork-list.component.html',
  styleUrls: ['./artwork-list.component.scss']
})
export class ArtworkListComponent implements OnInit {
  artworks: Artwork[] = [];
  currentUser: User | null = null;

  constructor(
    private artworkService: ArtworkService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSnapshot();
    this.loadArtworks();
  }

  loadArtworks(): void {
    this.artworkService.getArtworks().subscribe(data => {
      this.artworks = data;
    });
  }

  canDelete(artwork: Artwork): boolean {
    return this.currentUser?.role === 'artist' && this.currentUser._id === artwork.artist._id;
  }

  editArtwork(artworkId?: string): void {
    if (artworkId) {
      this.router.navigate(['/artworks/edit', artworkId]);
    } else {
      console.error('Hiányzó mű ID');
    }
  }

  deleteArtwork(id: string): void {
    if (confirm('Biztosan törlöd ezt a művet?')) {
      this.artworkService.deleteArtwork(id).subscribe({
        next: () => this.loadArtworks(),
        error: () => alert('Nem sikerült törölni.')
      });
    }
  }
}
