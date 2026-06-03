import { Component } from '@angular/core';
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { CharacterBasics } from './character-basics/character-basics';
import { CharacterRelations } from "./character-relations/character-relations";

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics, CdkDragHandle, CharacterRelations],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {
closeModal() {
  
}
}
