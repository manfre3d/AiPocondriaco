import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageSrc: string }) {}

  get imageSrc(): string {
    return this.data.imageSrc;
  }
}
