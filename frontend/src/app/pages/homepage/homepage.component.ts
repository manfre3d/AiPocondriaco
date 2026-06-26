import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebService } from '../../services/web.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../../image-modal/image-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoModalComponent } from '../../user-info-modal/user-info-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../data.service';

interface Message {
  text: string;
  type: 'system' | 'user';
  time: string;
  isStreaming?: boolean;
}

const STORAGE_KEY_PREFIX = 'aip_messages_';
const INITIAL_WELCOME: Message = {
  text: 'Hello! I\'m AiPocondria, your personal AI health companion. Tell me about yourself or any health concerns you\'d like to discuss.',
  type: 'system',
  time: '',
};

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  @ViewChild('chatBox') chatBoxRef!: ElementRef<HTMLDivElement>;

  isStreaming = false;
  messages: Message[] = [];
  newMessage = '';
  healthScore = 100;
  scoreHistory: number[] = [];
  userInfos: any = {};
  userKeys: string[] = [];
  userValues: any[] = [];
  userImage = '../../../assets/images/user_customer_person.png';
  isLoadingImage = false;
  imageVisible = false;
  imageDescription: string | undefined;
  generateImageCounter = 0;
  today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  constructor(
    private dataService: DataService,
    private webService: WebService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    INITIAL_WELCOME.time = this.currentTime();
    this.loadMessagesFromStorage();
    if (this.messages.length === 0) {
      this.messages = [{ ...INITIAL_WELCOME }];
    }
  }

  get healthTrend(): 'up' | 'down' | 'same' | null {
    if (this.scoreHistory.length < 2) return null;
    const diff = this.scoreHistory[this.scoreHistory.length - 1] - this.scoreHistory[this.scoreHistory.length - 2];
    if (diff > 0) return 'up';
    if (diff < 0) return 'down';
    return 'same';
  }

  currentTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  async sendMessage() {
    const messageToSend = this.newMessage.trim();
    if (!messageToSend || this.isStreaming) return;

    this.newMessage = '';
    this.messages.push({ text: messageToSend, type: 'user', time: this.currentTime() });

    const streamingMsg: Message = { text: '', type: 'system', time: this.currentTime(), isStreaming: true };
    this.messages.push(streamingMsg);
    const streamingIndex = this.messages.length - 1;

    this.isStreaming = true;
    this.scrollToBottom();

    try {
      const reader = await this.webService.streamConversation(messageToSend);
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') {
            this.zone.run(() => {
              this.messages[streamingIndex].isStreaming = false;
              this.isStreaming = false;
              this.saveMessagesToStorage();
            });
          } else {
            try {
              const { delta } = JSON.parse(payload);
              if (delta) {
                this.zone.run(() => {
                  this.messages[streamingIndex].text += delta;
                  this.scrollToBottom();
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      this.zone.run(() => {
        this.messages.splice(streamingIndex, 1);
        this.isStreaming = false;
        this.snackBar.open('Failed to get a response. Please try again.', 'OK', { duration: 3000 });
      });
      return;
    }

    // After AI response: update health score, user info, and image
    this.webService.getHealthScoreApi().subscribe({
      next: (res) => {
        const score = res.data?.healthScore;
        if (typeof score === 'number') {
          this.healthScore = score;
          this.scoreHistory.push(score);
        }
        this.webService.getUserInfo().subscribe({
          next: (infoRes) => {
            this.processUserInfo(infoRes?.data);
            this.fetchUserImage();
          },
          error: () => {},
        });
      },
      error: () => {},
    });
  }

  resetChat() {
    this.webService.resetConversation().subscribe({
      next: () => {
        this.messages = [{ ...INITIAL_WELCOME, time: this.currentTime() }];
        this.healthScore = 100;
        this.scoreHistory = [];
        this.userInfos = {};
        this.userKeys = [];
        this.userValues = [];
        this.userImage = '../../../assets/images/user_customer_person.png';
        this.imageVisible = false;
        this.imageDescription = undefined;
        this.generateImageCounter = 0;
        this.clearMessagesFromStorage();
      },
      error: () => {
        this.snackBar.open('Could not reset the conversation.', 'OK', { duration: 3000 });
      },
    });
  }

  logout() {
    localStorage.removeItem('sessionId');
    this.clearMessagesFromStorage();
    this.router.navigate(['/']);
  }

  onImageLoad() {
    this.isLoadingImage = false;
    this.imageVisible = true;
  }

  processUserInfo(userInfoCalculated: any) {
    if (!userInfoCalculated) return;
    this.userInfos = userInfoCalculated;
    this.userKeys = Object.keys(userInfoCalculated);
    this.userValues = Object.values(userInfoCalculated);
  }

  fetchUserImage() {
    if (this.generateImageCounter % 2 === 1) {
      this.generateImageCounter++;
      return;
    }
    this.isLoadingImage = true;
    this.imageVisible = false;
    this.webService.getGeneratedUserImage().subscribe({
      next: (res) => {
        this.userImage = res.data.image_url;
        this.imageDescription = res.data.description;
        this.generateImageCounter++;
      },
      error: () => {
        this.isLoadingImage = false;
      },
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBoxRef?.nativeElement) {
        this.chatBoxRef.nativeElement.scrollTop = this.chatBoxRef.nativeElement.scrollHeight;
      }
    }, 0);
  }

  openImageModal(): void {
    this.dialog.open(ImageModalComponent, {
      data: { imageSrc: this.userImage, description: this.imageDescription },
      height: '500px',
      width: '500px',
      maxWidth: '90vw',
    });
  }

  openUserInfoModal(): void {
    if (this.userKeys.length > 0) {
      this.dialog.open(UserInfoModalComponent, {
        data: { userKeys: this.userKeys, userValues: this.userValues },
      });
    } else {
      this.snackBar.open('No user information collected yet. Start chatting!', 'OK', { duration: 3000 });
    }
  }

  parseKey(key: string): string {
    return this.dataService.transformKeyString(key);
  }

  private storageKey(): string {
    const sessionId = localStorage.getItem('sessionId') ?? 'default';
    return STORAGE_KEY_PREFIX + sessionId;
  }

  private saveMessagesToStorage() {
    const toSave = this.messages.map((m) => ({ ...m, isStreaming: false }));
    localStorage.setItem(this.storageKey(), JSON.stringify(toSave));
  }

  private loadMessagesFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw) this.messages = JSON.parse(raw);
    } catch {}
  }

  onEnterKey(event: Event) {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      ke.preventDefault();
      this.sendMessage();
    }
  }

  private clearMessagesFromStorage() {
    localStorage.removeItem(this.storageKey());
  }
}
