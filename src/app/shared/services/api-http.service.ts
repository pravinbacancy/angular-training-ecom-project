import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

const dbEndPoint = environment.firebase.dbEndPoint;

@Injectable({
  providedIn: 'root'
})

export class ApiHttpService {

  constructor(
    private http: HttpClient
  ){}

  public get(url: string): Observable<any> {
    return this.http.get(dbEndPoint + url);
  }
  
  public post(url: string, data: any): Observable<any> {
    return this.http.post(dbEndPoint + url, data);
  }
  
  public put(url: string, data: any): Observable<any> {
    return this.http.put(dbEndPoint + url, data);
  }
  
  public delete(url: string): Observable<any> {
    return this.http.delete(dbEndPoint + url);
  }

}
