import { Component } from '@angular/core';
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { CharacterBasics } from './main-sheet/character-basics/character-basics';
import { CharacterRelations } from "./main-sheet/character-relations/character-relations";
import { CharacterBackpack } from './main-sheet/character-backpack/character-backpack';
import { CharacterTheme } from './main-sheet/character-theme/character-theme';
import { CharacterStatus } from "./main-sheet/character-status/character-status";
import { Background } from "./second-sheet/background/background";
import { Notes } from "./second-sheet/notes/notes";

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics, CdkDragHandle, CharacterRelations, CharacterBackpack, CharacterTheme, CharacterStatus, Background, Notes],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {

  activeTab = 'main';

closeModal() {
  
}
}
