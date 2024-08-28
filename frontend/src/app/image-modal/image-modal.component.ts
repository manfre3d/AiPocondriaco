import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-image-modal',
  standalone: true,
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  imports:[CommonModule]
})
export class ImageModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageSrc: string, description: string }) {}

  get imageSrc(): string {
    return this.data.imageSrc;
  }

  get description(): string {
    return this.data.description;
  }
}