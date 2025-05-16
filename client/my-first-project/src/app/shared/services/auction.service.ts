import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction } from '../model/auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:5000/app/auctions';

  constructor(private http: HttpClient) {}

  createAuction(data: {
    artworkId: string;
    startingPrice: number;
    startTime: string;
    endTime: string;
  }): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, data, {
      withCredentials: true
    });
  }

  getActiveAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.apiUrl}/active`, {
      withCredentials: true
    });
  }

  getAuction(id: string): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  placeBid(id: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/bid`, { amount }, {
      withCredentials: true
    });
  }
}
