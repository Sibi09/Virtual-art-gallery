import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuctionService } from '../../shared/services/auction.service';
import { ArtworkService } from '../../shared/services/artwork.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-auction-create',
  templateUrl: './auction-create.component.html',
  styleUrls: ['./auction-create.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class AuctionCreateComponent {
  form = this.fb.group({
    artworkId: ['', Validators.required],
    startingPrice: [0, [Validators.required, Validators.min(1)]],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  artworks$ = this.artworkService.getMyArtworks();

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private artworkService: ArtworkService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;
  
    const raw = this.form.value;
  
    const auctionPayload = {
      artworkId: raw.artworkId as string,
      startingPrice: raw.startingPrice as number,
      startTime: raw.startTime as string,
      endTime: raw.endTime as string
    };
  
    this.auctionService.createAuction(auctionPayload).subscribe({
      next: (created) => {
        this.router.navigate(['/auctions', created._id]);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Aukció létrehozása sikertelen.');
        }
      }
    });
  }
}
