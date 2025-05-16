import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Artwork } from '../model/Artwork';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private apiUrl = 'http://localhost:5000/app/artworks';

  constructor(private http: HttpClient) {}

  getArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(this.apiUrl, { withCredentials: true });
  }

  getMyArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/mine`, { withCredentials: true });
  }

  getOwnedArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/owned`, { withCredentials: true });
  }

  getAvailableArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.apiUrl}/available`, { withCredentials: true });
  }  

  createArtwork(artwork: Artwork): Observable<Artwork> {
    return this.http.post<Artwork>(this.apiUrl, artwork, { withCredentials: true });
  }

  uploadArtwork(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      withCredentials: true
    });
  }

  updateArtwork(id: string, data: Partial<Artwork>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });
  }

  deleteArtwork(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
