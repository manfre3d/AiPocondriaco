import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  messages: { text: string, type: string }[] = [
    { text: 'System: Hello, this is a test message!', type: 'system' },
    { text: 'User: Another message to show how this looks.', type: 'user' }
  ];
  newMessage: string = '';
  health: number = 80; // Example health value, you can dynamically update this


  constructor(private _webService: WebService ){ }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ text: `User: ${this.newMessage}`, type: 'user' });
      this.newMessage = '';
    }
    //test

    this._webService.postConversazioneApi().subscribe({
        next: (response) => {

        },
        error: (err) => {

      }
    });
  }
}
