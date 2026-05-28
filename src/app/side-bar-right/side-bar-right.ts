import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-bar-right',
  imports: [MatTabsModule, MatIcon, FormsModule],
  templateUrl: './side-bar-right.html',
  styleUrl: './side-bar-right.css' 
})
export class SideBarRight {

  message = '';
  chatMessages: {text: String, author: String, date: Date}[] = [];

  sendMessage() {
    if (this.message.trim()) {
      this.chatMessages.push({text: this.message, author: 'Master', date: new Date()})

      this.message = '';
    }
  }

}
