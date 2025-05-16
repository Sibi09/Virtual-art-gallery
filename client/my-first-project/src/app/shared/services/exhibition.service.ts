import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Exhibition {
  _id: string;
  title: string;
  description: string;
  date: Date;
  isLive: boolean;
  artist: {
    _id: string;
    username: string;
  };
  artworks?: {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  private apiUrl = 'http://localhost:5000/app/exhibitions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Exhibition[]> {
    return this.http.get<Exhibition[]>(this.apiUrl, { withCredentials: true });
  }

  getMine(): Observable<Exhibition[]> {
    return this.http.get<Exhibition[]>(`${this.apiUrl}/mine`, { withCredentials: true });
  }

  getById(id: string): Observable<Exhibition> {
    return this.http.get<Exhibition>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(data: Partial<Exhibition>): Observable<Exhibition> {
    return this.http.post<Exhibition>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: string, data: Partial<Exhibition>): Observable<Exhibition> {
    return this.http.put<Exhibition>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  assignArtworks(exhibitionId: string, artworkIds: string[]) {
    return this.http.put(`${this.apiUrl}/${exhibitionId}/artworks`, { artworkIds }, {
      withCredentials: true
    });
  }
}
