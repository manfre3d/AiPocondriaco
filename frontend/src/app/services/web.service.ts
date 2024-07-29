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

  postConversazioneApi(): Observable<any> {
    let request = {
      "messagePrompt":"what are you?"
    };

    return this.http.post<any>(this.getRadix() + 'prompts/test', request).pipe(
      map((response) => {
        console.log(response);
        return response.payload;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
}
