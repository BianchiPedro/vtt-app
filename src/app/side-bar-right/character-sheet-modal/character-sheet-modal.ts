import { Component, inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChild(CharacterRelations) relationsComponent!: CharacterRelations;
  @ViewChild(CharacterStatus) statusComponent!: CharacterStatus;
  @ViewChildren (CharacterTheme) themeComponents!: QueryList<CharacterTheme>;

  saveCharacter(){
    const pacoteBasics = this.basicsComponent.exportBasicsData();
    const pacoteBackpack = this.backpackComponent.exportBackpackData();
    const pacoteRelations = this.relationsComponent.exportRelationsData();
    const pacoteStatus = this.statusComponent.exportStatusData();
    const pacoteThemes = this.themeComponents.map(theme => theme.exportThemeData());

    const characterData = {
      id: Date.now(),
      name: pacoteBasics.nome || 'Fulano',
      type: 'Persoangem',
      basics: pacoteBasics.dados,

      item: pacoteBackpack.dados,

      relations: pacoteRelations.dados,

      status: pacoteStatus.dados,

      themes: pacoteThemes
    };

    this.characterService.saveCharacter(characterData);

    console.log('Dados extraídos', characterData)
  }

  closeModal() {
    
  }
}
