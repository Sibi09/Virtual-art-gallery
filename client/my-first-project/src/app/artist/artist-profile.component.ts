import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.scss']
})
export class ArtistProfileComponent implements OnInit {
  artist: any = null;
  artworks: any[] = [];
  exhibitions: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<any>(`http://localhost:5000/app/users/${id}/public-profile`, { withCredentials: true })
        .subscribe({
          next: res => {
            this.artist = res.user;
            this.artworks = res.artworks;
            this.exhibitions = res.exhibitions;
            this.loading = false;
          },
          error: () => this.loading = false
        });
    }
  }

  getImageUrl(path: string): string {
    return `http://localhost:5000${path}`;
  }
}
