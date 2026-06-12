import { Component, inject, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { CharacterBasics } from './main-sheet/character-basics/character-basics';
import { CharacterRelations } from "./main-sheet/character-relations/character-relations";
import { CharacterBackpack } from './main-sheet/character-backpack/character-backpack';
import { CharacterTheme } from './main-sheet/character-theme/character-theme';
import { CharacterStatus } from "./main-sheet/character-status/character-status";
import { Background } from "./second-sheet/background/background";
import { Notes } from "./second-sheet/notes/notes";
import { CharacterService } from './character-sheet.service';

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics, CdkDragHandle, CharacterRelations, CharacterBackpack, CharacterTheme, CharacterStatus, Background, Notes],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {

  activeTab = 'main';
  private characterService = inject(CharacterService);

  @ViewChild(CharacterBasics) basicsComponent!: CharacterBasics;
  @ViewChild(CharacterBackpack) backpackComponent!: CharacterBackpack;

  saveCharacter(){
    const pacoteBasics = this.basicsComponent.exportBasicsData();
    const pacoteBackpack = this.backpackComponent.exportBackpackData();

    const characterData = {
      id: Date.now(),
      name: pacoteBasics.nome || 'Fulano',
      type: 'Persoangem',
      basics: pacoteBasics.dados,

      item: pacoteBackpack.dados,
    };

    this.characterService.saveCharacter(characterData);

    console.log('Dados extraídos', characterData)
  }

  closeModal() {
    
  }
}
