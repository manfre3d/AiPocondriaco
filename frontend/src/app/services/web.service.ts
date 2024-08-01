import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  constructor(private http: HttpClient) {}

  getRadix(): string {
    if (window.location.hostname === 'localhost') {
      return `http://localhost:3000/`;
    } else {
      return window.location.protocol + '//' + window.location.hostname + '/';
    }
  }

  postConversazioneApi(message: string): Observable<any> {
    let request = {
      "messagePrompt":message
    };

    return this.http.post<any>(this.getRadix() + 'prompts/conversation', request).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
  getConversazioneApi(): Observable<any> {

    return this.http.get<any>(this.getRadix() + 'prompts/conversation').pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
  getHealthScoreApi(): Observable<any> {

    return this.http.get<any>(this.getRadix() + 'prompts/healthScore').pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
  getUserInfo(): Observable<any> {

    return this.http.get<any>(this.getRadix() + 'prompts/userInfo').pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
}
