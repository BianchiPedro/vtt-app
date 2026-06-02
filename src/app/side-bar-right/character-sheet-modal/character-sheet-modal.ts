import { Component } from '@angular/core';
import { CdkDrag } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import { CharacterBasics } from './character-basics/character-basics';

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {
closeModal() {
  
}
}
