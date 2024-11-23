import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpService {
  private apiUrl = 'http://localhost/mimen-main/api.php?action=list-emp'; // Cambia esta URL según tu backend

  constructor(private http: HttpClient) {}

  getEmps(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
