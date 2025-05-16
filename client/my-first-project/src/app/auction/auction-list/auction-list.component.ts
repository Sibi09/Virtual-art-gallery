import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auction } from '../../shared/model/auction';
import { AuctionService } from '../../shared/services/auction.service';

@Component({
  standalone: true,
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class AuctionListComponent implements OnInit {
  auctions: Auction[] = [];
  loading = true;
  error = '';

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.auctionService.getActiveAuctions().subscribe({
      next: (data: Auction[]) => {
        this.auctions = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Hiba történt az aukciók betöltésekor.';
        console.error(err);
        this.loading = false;
      }
    });
  }
}
