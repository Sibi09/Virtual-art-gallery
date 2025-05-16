import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { switchMap, catchError, of } from 'rxjs';

import { LoginDTO } from '../model/login.dto';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'artist' | 'collector' | 'guest';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/app';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private isAuthenticated = false;

  login(data: LoginDTO): Observable<User> {
    return this.http.post<{ message: string, user: User }>(
      `${this.apiUrl}/users/login`, data, { withCredentials: true }
    ).pipe(
      switchMap(() => this.getCurrentUser(true))
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  getCurrentUser(force = false): Observable<User> {
    if (!force && !this.isAuthenticated) {
      return of(null as any);
    }
  
    return this.http.get<User>(`${this.apiUrl}/users/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.isAuthenticated = true;
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        this.isAuthenticated = false;
        return of(null as any);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUserSubject.value;
  }
}