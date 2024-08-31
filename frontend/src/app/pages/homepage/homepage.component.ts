import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../../image-modal/image-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoModalComponent } from '../../user-info-modal/user-info-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  isLoading: boolean = false;
  chatBox = document.getElementById('chat-box');
  messages: { text: string; type: string }[] = [
    {
      text: 'Ciao! Sono AI Pocondria, il tuo assistente virtuale per la salute e il benessere. Come posso aiutarti oggi?',
      type: 'system',
    },
    // { text: 'User: Another message to show how this looks.', type: 'user' }
  ];
  newMessage: string = '';
  healthScore: number = 100; // Example health value, you can dynamically update this
  userInfos: any = {};
  userKeys: any = [];
  userValues: any = [];
  userImage: string = '../../../assets/images/user_customer_person.png';
  // userImage : string = "https://via.placeholder.com/1000";
  // userImage : string = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-1usEqFDsADBD2EmLgrZbd03g/user-grTWJWZV6ER2wMVZLtYHJ9r0/img-hiuU9OpLANInSEgK5wqA48Hj.png?st=2024-08-24T16%3A40%3A39Z&se=2024-08-24T18%3A40%3A39Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-08-23T23%3A10%3A16Z&ske=2024-08-24T23%3A10%3A16Z&sks=b&skv=2024-08-04&sig=bhrzjhZ2hqoD8ST0Fu0nH2egaiPxFZWwSsW9%2Bu0%2BMvs%3D";
  resizeTextareas: boolean = false;
  isLoadingImage: boolean = false;

  imageVisible: boolean = false;
  imageDescription: any = undefined;
  generateImageCounter: number = 0;
  shouldScroll: boolean = false;

  constructor(
    private dataService: DataService,
    private _webService: WebService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log(Object.keys(this.userInfos));
    this.userKeys = Object.keys(this.userInfos);
    this.userValues = Object.values(this.userInfos);
  }

  ngAfterViewChecked() {
    if (this.resizeTextareas) this.adjustTextareas();
    if(this.shouldScroll) this.scrollToLastMessage();
  }
  onImageLoad() {
    console.log('loaded img');
    console.log(this.userImage);
    this.isLoadingImage = false;
    this.imageVisible = true;
  }
  adjustTextareas() {
    this.resizeTextareas = false;
    this.messages.forEach((message, index) => {
      this.textareaAdjustment(message.type, index);
    });
    this.scrollToLastMessage();
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    console.log(textarea.style.height);
  }
  processUserInfo(userInfoCalculated: any) {
    this.userInfos = userInfoCalculated;
    this.userKeys = Object.keys(userInfoCalculated);
    this.userValues = Object.values(userInfoCalculated);
  }
  textareaAdjustment(messageType: string, index: number) {
    const textareaId = `${messageType}${index}`;
    const textarea = document.getElementById(
      textareaId
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 10}px`;
    }
  }
  scrollToLastMessage() {
    console.log('change');
    this.shouldScroll = false;
    let lastMessagePosition = this.messages.length - 1;
    let role = this.messages[lastMessagePosition].type;
    let lastMessageId = role + lastMessagePosition;
    const textarea = document.getElementById(
      lastMessageId
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  fetchUserImage() {
    if (this.generateImageCounter % 2 == 1) {
      this.generateImageCounter++;
      return;
    }
    this.isLoadingImage = true;
    this.imageVisible = false;
    this._webService.getGeneratedUserImage().subscribe({
      next: (response) => {
        console.log(response);
        this.userImage = response.data.image_url;
        this.imageDescription = response.data.description;
        this.generateImageCounter++;
      },
      error: (err) => {
        this.isLoadingImage = false;
      },
    });
  }
  sendMessage() {
    console.log('Send form conversation');
    let messageToSend = this.newMessage;
    if (this.newMessage.trim() !== '') {
      this.messages.push({ text: `${this.newMessage}`, type: 'user' });
      this.newMessage = '';
    }
    //scroll + size reset for user input box
    this.shouldScroll = true;
    this.resizeTextareas = true;
    //chain of calls conversation functions + image generation
    this.isLoading = true;
    console.log(this.messages[this.messages.length - 1].type);

    this._webService.postConversazioneApi(messageToSend).subscribe({
      next: (response) => {
        console.log(response);
        this._webService.getConversazioneApi().subscribe({
          next: (response) => {
            console.log(response);
            let maxLengthConversation = response?.conversation.length - 1;
            let messaggioAssistente =
              response?.conversation[maxLengthConversation].content;
            console.log(`lunghezza conversazione ${maxLengthConversation}`);
            console.log(response?.conversation[maxLengthConversation].content);
            this.messages.push({
              text: `${messaggioAssistente}`,
              type: 'system',
            });
            //activates the flag that allows for textarea resizing after messages array update
            this.resizeTextareas = true;
            console.log('system' + (this.messages.length - 1));
            console.log(this.messages);
            this._webService.getHealthScoreApi().subscribe({
              next: (response) => {
                console.log('health score');
                console.log(response);
                this.healthScore = response.data.healthScore;
                this._webService.getUserInfo().subscribe({
                  next: (response) => {
                    console.log('user info obj');
                    console.log(response);
                    this.processUserInfo(response?.data);
                    this.fetchUserImage();
                  },
                });
              },
            });
          },
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  openImageModal(): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        imageSrc: this.userImage,
        description: this.imageDescription,
      },
      height: '500px', // Set the height to 70% of the viewport height
      width: '500px', // Adjust the width based on the image or content
      maxWidth: '80vw', // Optionally set a max-width to control the width
    });
  }
  openUserInfoModal(): void {
    if (this.userKeys.length > 0) {
      this.dialog.open(UserInfoModalComponent, {
        data: {
          userKeys: this.userKeys,
          userValues: this.userValues,
        },
      });
    } else {
      this.snackBar.open(
        "Non ci sono informazioni disponibili per l'utente.",
        'OK',
        {
          duration: 3000, // Durata del messaggio
        }
      );
    }
  }
  //makes the keys more readable for the user
  parseKey(key:string):string{
    return this.dataService.transformKeyString(key); 

  }
}
