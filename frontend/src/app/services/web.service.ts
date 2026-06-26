import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebService {
  constructor(private http: HttpClient) {}

  getRadix(): string {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000/';
    }
    return window.location.protocol + '//' + window.location.hostname + '/';
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.getRadix() + 'auth/login', { email, password }).pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }

  register(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(this.getRadix() + 'auth/register', { name, email, password, confirmPassword }).pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }

  // Streaming via native fetch — returns a ReadableStream reader
  async streamConversation(message: string): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const sessionId = localStorage.getItem('sessionId') || '';
    const response = await fetch(this.getRadix() + 'prompts/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({ messagePrompt: message }),
    });
    if (!response.body) throw new Error('No response body');
    return response.body.getReader();
  }

  resetConversation(): Observable<any> {
    return this.http.delete<any>(this.getRadix() + 'prompts/conversation').pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }

  getHealthScoreApi(): Observable<any> {
    return this.http.get<any>(this.getRadix() + 'prompts/healthScore').pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(this.getRadix() + 'prompts/userInfo').pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }

  getGeneratedUserImage(): Observable<any> {
    return this.http.get<any>(this.getRadix() + 'prompts/generateImage').pipe(
      map((res) => res),
      catchError((err) => { throw err; })
    );
  }
}
