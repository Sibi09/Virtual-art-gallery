import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:5000/app/events';
  constructor(private http: HttpClient) {}

  createEvent(eventData: any): Observable<any> {
    return this.http.post(this.apiUrl, eventData, {
      withCredentials: true
    });
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`, {
      withCredentials: true
    });
  }

  updateEvent(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}`, data, {
      withCredentials: true
    });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`, {
      withCredentials: true
    });
  }
}
