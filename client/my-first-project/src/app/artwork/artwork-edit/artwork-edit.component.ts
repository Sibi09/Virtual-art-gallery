import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtworkService, Artwork } from '../../shared/services/artwork.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-artwork-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './artwork-edit.component.html',
  styleUrls: ['./artwork-edit.component.scss']
})
export class ArtworkEditComponent implements OnInit {
  artworkId = '';
  artwork: Artwork = {
    title: '',
    description: '',
    imageUrl: '',
    price: 0
  };
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  ngOnInit(): void {
    this.artworkId = this.route.snapshot.paramMap.get('id') || '';
    if (this.artworkId) {
      this.artworkService.getArtworks().subscribe(artworks => {
        const found = artworks.find(a => a._id === this.artworkId);
        if (found) this.artwork = found;
        else this.error = 'Nem található a mű!';
      });
    }
  }

  onSave(): void {
    this.artworkService.updateArtwork(this.artworkId, this.artwork).subscribe({
      next: () => this.router.navigate(['/artworks']),
      error: () => this.error = 'Nem sikerült menteni a módosításokat.'
    });
  }
}
