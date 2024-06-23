import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = { username, password };

    return this.http.post<any>(`${this.baseUrl}/api/token/`, body, { headers });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessToken');
  }

  logout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    this.loggedIn.next(false);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedIn.next(loggedIn);
  }
}
