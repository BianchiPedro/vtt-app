import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { InvokeFunctionExpr } from '@angular/compiler';
import { CharacterSheetModal } from './character-sheet-modal/character-sheet-modal';


export interface Folders {
  name: string,
  isOpen: boolean,
  items: any[],
}

@Component({
  selector: 'app-side-bar-right',
  imports: [MatTabsModule, MatIcon, FormsModule, CommonModule, MatMenuModule, MatDialogModule],
  templateUrl: './side-bar-right.html',
  styleUrl: './side-bar-right.css' 
})
export class SideBarRight {
  
  dialog = inject(MatDialog);

  // CHAT COMPONENT --------------------------------------------------------------------------------------

  message = '';
  
  chatMessages: {
    text?: string, 
    author: string, 
    date: Date, 
    isRoll?: boolean, 
    rollData?: { dice1: number, dice2: number, modifier: number, total: number, outcome: string, borderColor: string, textColor: string }
  }[] = [];

  sendMessage() {
    const textoLimpo = this.message.trim();

    if (!textoLimpo) return;

    if (textoLimpo === '/clear') {
      this.chatMessages = [];
      this.message = '';
      return;
    }

    if (textoLimpo.startsWith('/roll')) {
      this.onRoll();
      return;
    }

    this.chatMessages.push({text: textoLimpo, author: 'Master (GM)', date: new Date()});
    this.message = '';
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

      const dice1 = Math.floor(Math.random() * 12) + 1;
      const dice2 = Math.floor(Math.random() * 12) + 1;
      const total = dice1 + dice2 + modifier;

      let outcomeText = '';
      let colorClass = '';
      let textColor = '';

      if (total < 0) {
        outcomeText = 'FALHA CRÍTICA...';
        colorClass = 'border-red-600';
        textColor = 'text-red-600';
      } else if (total <= 12) {
        outcomeText = 'FALHA';
        colorClass = 'border-orange-600';
        textColor = 'text-orange-600';
      } else if (total <= 19) {
        outcomeText = 'SUCESSO PARCIAL';
        colorClass = 'border-blue-600';
        textColor = 'text-blue-600';
      } else if (total <= 24) {
        outcomeText = 'SUCESSO';
        colorClass = 'border-green-600';
        textColor = 'text-green-600';
      } else {
        outcomeText = 'SUCESSO CRÍTICO!!';
        colorClass = 'border-amber-400';
        textColor = 'text-amber-300';
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
          outcome: outcomeText,
          borderColor: colorClass,
          textColor: textColor,
        }
      });
      
      this.message = ''; 
  }

  // CREATING SHEETS -----------------------------------------------------------------------------

  folders: Folders[] = [
    {name: "Personagens (PJ's)", isOpen: false, items: []},
    {name: "NPC's", isOpen: false, items: []},
    {name: "Folhetos", isOpen: false, items: []}
  ];

  createitem(type: string) {
    if (type === 'Personagem') {
      this.dialog.open(CharacterSheetModal, {
        hasBackdrop: false,
        width: '80vw',        // Ocupa 90% da largura da tela do mestre inicialmente
        height: '95vh',       // Ocupa 85% da altura da tela inicialmente
        maxWidth: '95vw',     // Permite expandir quase até a borda da tela
        maxHeight: '95vh',    // Permite expandir quase até o topo/fundo
        panelClass: 'custom-vtt-dialog' // Classe para podermos aplicar o CSS de resize
      });
    } else if (type === 'NPC') {
      console.log('Ainda vamos criar a lógica do NPC!');
    } else if (type === 'Folheto') {
      console.log('Ainda vamos criar a lógica do Folheto!');
    }
  }


}