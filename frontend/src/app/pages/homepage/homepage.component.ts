import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebService } from '../../services/web.service';

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
export class HomepageComponent implements OnInit{

  messages: { text: string, type: string }[] = [
    { text: 'Ciao sono AI Pocondrio, l\'assistente virtuale per la salute e il benessere, come posso esserti utile oggi?', type: 'system' },
    // { text: 'User: Another message to show how this looks.', type: 'user' }
  ];
  newMessage: string = '';
  healthScore: number = 100; // Example health value, you can dynamically update this
  userInfos : any= {};
  userKeys : any = []
  userValues : any = []
  
  constructor(private _webService: WebService ){ }
  ngOnInit(): void {
    console.log(Object.keys(this.userInfos));
    this.userKeys = Object.keys(this.userInfos);
    this.userValues = Object.values(this.userInfos);
  }
  
  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  processUserInfo(userInfoCalculated: any){
    this.userInfos = userInfoCalculated;
    this.userKeys = Object.keys(userInfoCalculated);
    this.userValues = Object.values(userInfoCalculated);
  }
  sendMessage() {
    console.log("Send form conversation")
    let messageToSend = this.newMessage;
    if (this.newMessage.trim() !== '') {
      this.messages.push({ text: `User: ${this.newMessage}`, type: 'user' });
      this.newMessage = '';
    }
    //test
    this._webService.postConversazioneApi(messageToSend).subscribe({
        next: (response) => {
          console.log(response)
          this._webService.getConversazioneApi().subscribe({
            next:(response)=>{
              console.log(response)
              let maxLengthConversation = response?.conversation.length-1;
              let messaggioAssistente = response?.conversation[maxLengthConversation].content;
              console.log(`lunghezza conversazione ${maxLengthConversation}`);
              console.log(response?.conversation[maxLengthConversation]);
              this.messages.push({ text: `System: ${messaggioAssistente}`, type: 'system' });
              this._webService.getHealthScoreApi().subscribe({
                next:(response)=>{
                  
                  console.log("health score");
                  console.log(response);
                  this.healthScore = response.data.healthScore;
                  this._webService.getUserInfo().subscribe({
                    next:(response)=>{
                      
                      console.log("user info obj");
                      console.log(response);
                      this.processUserInfo(response?.data);
                      
                    }
                   
                  })
                }
               
              })
              
            }
          })
        }
    });
  }
}
