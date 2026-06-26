import { Injectable } from '@angular/core';

// Maps Italian keys (from the AI's JSON) to readable English labels
const KEY_MAP: Record<string, string> = {
  'altezza': 'Height',
  'peso': 'Weight',
  'età': 'Age',
  'eta': 'Age',
  'nome': 'Name',
  'cognome': 'Last Name',
  'email': 'Email',
  'sesso': 'Sex',
  'bmi': 'BMI',
  'punteggioSalute': 'Health Score',
  'attivitaFisica': 'Physical Activity',
  'attivitàFisica': 'Physical Activity',
  'statoPeso': 'Weight Status',
  'condizioneSalute': 'Health Condition',
  'alimentazione': 'Diet',
  'fumo': 'Smoking',
  'alcol': 'Alcohol',
  'pressione': 'Blood Pressure',
  'colesterolo': 'Cholesterol',
  'glicemia': 'Blood Sugar',
  'malattie': 'Conditions',
  'farmaci': 'Medications',
  'stress': 'Stress Level',
  'sonno': 'Sleep',
};

@Injectable({ providedIn: 'root' })
export class DataService {
  transformKeyString(input: string): string {
    const mapped = KEY_MAP[input] ?? KEY_MAP[input.toLowerCase()];
    if (mapped) return mapped;
    // Fall back: split camelCase/underscores and title-case
    return input
      .replace(/[_-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
