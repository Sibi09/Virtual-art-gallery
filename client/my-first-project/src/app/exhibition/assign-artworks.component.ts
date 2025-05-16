import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArtworkService, Artwork } from '../shared/services/artwork.service';
import { ExhibitionService } from '../shared/services/exhibition.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assign-artworks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './assign-artworks.component.html',
  styleUrls: ['./assign-artworks.component.scss']
})
export class AssignArtworksComponent implements OnInit {
  form!: FormGroup;
  artworks: Artwork[] = [];
  selectedArtworkIds: string[] = [];
  exhibitionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService,
    private exhibitionService: ExhibitionService
  ) {}

  ngOnInit(): void {
    this.exhibitionId = this.route.snapshot.paramMap.get('id');
    if (!this.exhibitionId) return;

    this.artworkService.getMyArtworks().subscribe(data => {
      this.artworks = data;
    });
  }

  toggleSelection(id: string, checked: boolean): void {
    if (checked) {
      this.selectedArtworkIds.push(id);
    } else {
      this.selectedArtworkIds = this.selectedArtworkIds.filter(i => i !== id);
    }
  }

  save(): void {
    if (!this.exhibitionId) return;

    this.exhibitionService.assignArtworks(this.exhibitionId, this.selectedArtworkIds).subscribe({
      next: () => this.router.navigate(['/exhibitions']),
      error: () => alert('Hozzárendelés sikertelen.')
    });
  }
}
