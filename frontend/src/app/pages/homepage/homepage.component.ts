import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebService } from '../../services/web.service';
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent
],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{
  isLoading: boolean = false;
  chatBox = document.getElementById("chat-box");
  
  messages: { text: string, type: string }[] = [
    { text: 'Ciao sono AI Pocondrio, l\'assistente virtuale per la salute e il benessere, come posso esserti utile oggi?', type: 'system' },
    // { text: 'User: Another message to show how this looks.', type: 'user' }
  ];
  newMessage: string = '';
  healthScore: number = 100; // Example health value, you can dynamically update this
  userInfos : any= {};
  userKeys : any = []
  userValues : any = []
  userImage : string = "https://via.placeholder.com/1000";
  
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
    console.log(textarea.style.height)
  }
  processUserInfo(userInfoCalculated: any){
    this.userInfos = userInfoCalculated;
    this.userKeys = Object.keys(userInfoCalculated);
    this.userValues = Object.values(userInfoCalculated);
  }
  textareaAdjustment(messageType: string){
    let textareaId = messageType+(this.messages.length-1);
    console.log(textareaId);
    let textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if(textarea){
      // textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight+10}px`;
      console.log(textarea.style.height);
      textarea?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  sendMessage() {
    console.log("Send form conversation")
    let messageToSend = this.newMessage;
    if (this.newMessage.trim() !== '') {
      this.messages.push({ text: `User: ${this.newMessage}`, type: 'user' });
      this.newMessage = '';
    }
    //chain of calls conversation functions + image generation
    this.isLoading = true;
    console.log(this.messages[this.messages.length-1].type)
    // this.textareaAdjustment(this.messages[this.messages.length-1].type);

    this._webService.postConversazioneApi(messageToSend).subscribe({
        next: (response) => {
          this.textareaAdjustment(this.messages[this.messages.length-1].type);

          console.log(response)
          this._webService.getConversazioneApi().subscribe({
            next:(response)=>{
              console.log(response)
              let maxLengthConversation = response?.conversation.length-1;
              let messaggioAssistente = response?.conversation[maxLengthConversation].content;
              console.log(`lunghezza conversazione ${maxLengthConversation}`);
              console.log(response?.conversation[maxLengthConversation].content);
              this.messages.push({ text: `System: ${messaggioAssistente}`, type: 'system' });
              console.log("system"+(this.messages.length-1));
              console.log(this.messages);
              // console.log(document.getElementById("system"+(this.messages.length-1))?.innerHTML)
              this._webService.getHealthScoreApi().subscribe({
                next:(response)=>{
                  console.log("health score");
                  console.log(response);
                  this.textareaAdjustment(this.messages[this.messages.length-1].type);
                  
                  this.healthScore = response.data.healthScore;
                  this._webService.getUserInfo().subscribe({
                    next:(response)=>{
                      
                      console.log("user info obj");
                      console.log(response);
                      this.processUserInfo(response?.data);
                      this._webService.getGeneratedUserImage().subscribe({
                        next:(response)=>{
                          console.log(response);
                          this.userImage = response.data;
                        }
                      })
                    }
                   
                  })
                }
               
              })
              
            }
          })
        },
        complete: () => {
          this.isLoading = false;
        }
    });
  }
}
