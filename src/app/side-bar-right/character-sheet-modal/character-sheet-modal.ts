import { Component } from '@angular/core';
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { CharacterBasics } from './character-basics/character-basics';
import { CharacterRelations } from "./character-relations/character-relations";
import { CharacterBackpack } from './character-backpack/character-backpack';
import { CharacterTheme } from './character-theme/character-theme';
import { CharacterStatus } from "./character-status/character-status";

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics, CdkDragHandle, CharacterRelations, CharacterBackpack, CharacterTheme, CharacterStatus],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {

  activeTab = 'main';

closeModal() {
  
}
}
