import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar-right',
  imports: [MatTabsModule, MatIcon, FormsModule, CommonModule],
  templateUrl: './side-bar-right.html',
  styleUrl: './side-bar-right.css' 
})
export class SideBarRight {

  message = '';
  chatMessages: {
    text?: string, 
    author: string, 
    date: Date, 
    isRoll?: boolean, 
    rollData?: { dice1: number, dice2: number, modifier: number, total: number, outcome: string }
    }[] = [];

  sendMessage() {

    //CLEAR COMMAND
    if (this.message.trim() === '/clear') {
      this.chatMessages = [];
      this.message = '';
      return
    }

    // ROLL COMAND
    if (this.message.trim().startsWith('/roll')) {
      this.onRoll();
    }

    // COMMON TEXT
    if (this.message.trim()) {
      this.chatMessages.push({text: this.message, author: 'Master (GM)', date: new Date()})

      this.message = '';
    }
  }

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  onRoll() {
      const modificadorString = this.message.replace('/roll', '').replace(/\s+/g, '');
      const modifier = parseInt(modificadorString) || 0;

      const dice1 = Math.floor(Math.random() * 12) +1;
      const dice2 = Math.floor(Math.random() * 12) +1;

      const total = dice1 + dice2 + modifier;

      let textModifier = '';
      if (modifier > 0) {
        textModifier = ` + ${modifier}`;
      } else if (modifier < 0) {
        textModifier = ` - ${Math.abs(modifier)}`;
      }

      let outcomeText = '';

      if (total < 0) {
        outcomeText = 'FALHA CRÍTICA...'
      } else if (total <= 12) {
        outcomeText = 'FALHA'
      } else if (total <= 19) {
        outcomeText = 'SUCESSO PARCIAL'
      } else if (total <= 24) {
        outcomeText = 'SUCESSO'
      } else {
        outcomeText = 'SUCESSO CRÍTICO!!'
      }

      this.chatMessages.push({ 
        author: 'System', 
        date: new Date(),
        isRoll: true,
        rollData: {
          dice1: dice1,
          dice2: dice2,
          modifier: modifier,
          total: total,
          outcome: outcomeText
        }
      });

      this.message = '';
  }
}
