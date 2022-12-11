import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

const dbEndPoint = environment.firebase.dbEndPoint;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class ApiHttpService {

  constructor(
    private http: HttpClient
  ){}

  public get(url: string): Observable<any> {
    return this.http.get(dbEndPoint + url, httpOptions);
  }
  
  public post(url: string, data: any): Observable<any> {
    return this.http.post(dbEndPoint + url, data, httpOptions);
  }
  
  public put(url: string, data: any): Observable<any> {
    return this.http.put(dbEndPoint + url, data, httpOptions);
  }
  
  public delete(url: string): Observable<any> {
    return this.http.delete(dbEndPoint + url, httpOptions);
  }

}
