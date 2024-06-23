import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCabecerasVentas(): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.baseUrl}/api/cabecera-ventas/`, { headers });
  }

  createCabeceraVenta(cabeceraVenta: any): Observable<any> {
    const token = sessionStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}/api/cabecera-ventas/`, cabeceraVenta, { headers });
  }
}
