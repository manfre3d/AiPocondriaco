import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-info-modal',
  standalone: true,
  templateUrl: './user-info-modal.component.html',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  styleUrls: ['./user-info-modal.component.scss'],
})
export class UserInfoModalComponent implements OnInit {
  itemsPerPage: number = 5; // Numero di elementi per pagina
  currentPage: number = 0; // Pagina corrente
  totalPages: number = 0; // Numero totale di pagine

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userKeys: string[]; userValues: any[] }
  ) {}

  ngOnInit() {
    this.totalPages = Math.ceil(this.userKeys.length / this.itemsPerPage);
  }

  get userKeys(): string[] {
    return this.data.userKeys;
  }

  get userValues(): any[] {
    return this.data.userValues;
  }

  get paginatedKeys(): string[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.userKeys.slice(start, start + this.itemsPerPage);
  }

  get paginatedValues(): any[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.userValues.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
}
