import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuctionService } from '../../shared/services/auction.service';
import { AuthService, User } from '../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class AuctionDetailComponent implements OnInit {
  auction: any;
  loading = true;
  error: string | null = null;
  bidAmount: number | null = null;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.auth.currentUser$.subscribe(u => (this.user = u));

    if (id) {
      this.auctionService.getAuction(id).subscribe({
        next: (data) => {
          this.auction = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Aukció nem található.';
          this.loading = false;
        }
      });
    }
  }

  placeBid(): void {
    if (!this.auction || !this.bidAmount) return;

    this.auctionService.placeBid(this.auction._id, this.bidAmount).subscribe({
      next: () => {
        this.auction.currentBid = this.bidAmount;
        this.auction.bidHistory.push({
          userId: { username: this.user?.username },
          amount: this.bidAmount
        });
        this.bidAmount = null;
      },
      error: () => {
        alert('A licitálás nem sikerült.');
      }
    });
  }

  getImageUrl(path: string): string {
    return 'http://localhost:5000' + path;
  }
}
