import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  transformKeyString(input: string): string {
    input = input.replace(/[_-]/g, ' ');
    input = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    input = input.replace(/\b\w/g, (char) => char.toUpperCase());

    return input;
  }
}
