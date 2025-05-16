import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhibitionService, Exhibition } from '../../shared/services/exhibition.service';
import { AuthService, User } from '../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exhibition-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './exhibition-list.component.html',
  styleUrls: ['./exhibition-list.component.scss']
})
export class ExhibitionListComponent implements OnInit {
  exhibitions: Exhibition[] = [];
  currentUser: User | null = null;

  constructor(
    private exhibitionService: ExhibitionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSnapshot();
    this.loadExhibitions();
  }

  loadExhibitions(): void {
    this.exhibitionService.getAll().subscribe(data => {
      this.exhibitions = data;
    });
  }

  assignArtworks(exhibitionId: string): void {
    this.router.navigate(['/exhibitions', exhibitionId, 'assign']);
  }

  canEdit(exhibition: Exhibition): boolean {
    return this.currentUser?.role === 'artist' && this.currentUser._id === exhibition.artist._id;
  }

  editExhibition(id: string): void {
    this.router.navigate(['/exhibitions/edit', id]);
  }

  deleteExhibition(id: string): void {
    if (confirm('Biztosan törlöd ezt a kiállítást?')) {
      this.exhibitionService.delete(id).subscribe(() => {
        this.loadExhibitions();
      });
    }
  }
}
