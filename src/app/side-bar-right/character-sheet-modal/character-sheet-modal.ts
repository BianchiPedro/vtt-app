import { Component, inject, ViewChild, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spells } from "./main-sheet/spells/spells";
import { CharacterImage } from './main-sheet/character-image/character-image';

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag, MatIcon, CharacterBasics, CdkDragHandle, CharacterRelations, CharacterBackpack, CharacterTheme, CharacterStatus, Background, Notes, Spells, CharacterImage],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal implements AfterViewInit {

  ngAfterViewInit() {
    if (this.data) {
      setTimeout(() => {
        this.basicsComponent.loadData(this.data.name, this.data.basics);
        this.backpackComponent.backpackData = this.data.item;
        this.relationsComponent.relationsData = this.data.relations;
        this.statusComponent.statusData = this.data.status;
        
        this.themeComponents.forEach((ThemeComp, index) => {
          if(this.data.themes[index]) {
            ThemeComp.themeData = this.data.themes[index];
          }
        });

        if (this.backgroundComponent && this.data.backgroundText) {
          this.backgroundComponent.backgroundText = this.data.backgroundText;
        }

        if (this.noteComponent && this.data.notes) {
          this.noteComponent.pages = this.data.notes;
        }
        
        if (this.spellComponent && this.data.spells && this.data.spells.length > 0) {
          this.spellComponent.spellsData = this.data.spells;
        }

        if (this.imageComponent && this.data.characterImage) {
          this.imageComponent.characterImage = this.data.characterImage;
          // Passar o ID do personagem para o componente de imagem
          this.imageComponent.characterId = this.data.id;
        }

        this.cdr.detectChanges();
      });
    }
  }

  activeTab = 'main';
  private characterService = inject(CharacterService);
  private dialogRef = inject(MatDialogRef<CharacterSheetModal>);
  private cdr = inject(ChangeDetectorRef);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  @ViewChild(CharacterBasics) basicsComponent!: CharacterBasics;
  @ViewChild(CharacterBackpack) backpackComponent!: CharacterBackpack;
  @ViewChild(CharacterRelations) relationsComponent!: CharacterRelations;
  @ViewChild(CharacterStatus) statusComponent!: CharacterStatus;
  @ViewChildren (CharacterTheme) themeComponents!: QueryList<CharacterTheme>;
  @ViewChild (Background) backgroundComponent!: Background;
  @ViewChild (Notes) noteComponent!: Notes;
  @ViewChild (Spells) spellComponent!: Spells;
  @ViewChild(CdkDrag) dragInstance!: CdkDrag;
  @ViewChild(CharacterImage) imageComponent?: CharacterImage;

  saveCharacter(){
    const pacoteBasics = this.basicsComponent.exportBasicsData();
    const pacoteBackpack = this.backpackComponent.exportBackpackData();
    const pacoteRelations = this.relationsComponent.exportRelationsData();
    const pacoteStatus = this.statusComponent.exportStatusData();
    const pacoteThemes = this.themeComponents.map(theme => theme.exportThemeData());
    const textoBackground = this.backgroundComponent ? this.backgroundComponent.exportBackgroundData() : '';
    const listaNotas = this.noteComponent ? this.noteComponent.exportNoteData() : [];
    const listaSpells = this.spellComponent ? this.spellComponent.exportSpellsData() : [];
    const imagemPersonagem = this.imageComponent ? this.imageComponent.exportCharacterImage() : null;

    const characterId = this.data ? this.data.id : Date.now();
    const characterData = {
      id: characterId,
      name: pacoteBasics.nome || 'Fulano',
      type: 'Persoangem',
      basics: pacoteBasics.dados,
      item: pacoteBackpack.dados,
      relations: pacoteRelations.dados,
      status: pacoteStatus.dados,
      themes: pacoteThemes,
      backgroundText: textoBackground,
      notes: listaNotas,
      spells: listaSpells,
      characterImage: imagemPersonagem
    };

    this.characterService.saveCharacter(characterData);
    // Se houver imagem, garantir que está sincronizada via serviço
    if (imagemPersonagem) {
      this.characterService.updateCharacterImage(characterId, imagemPersonagem);
    }
    this.data = characterData;

    console.log('Dados extraídos', characterData)
  }

  isMinimized = false;

  toggleMinimized() {
    this.isMinimized = !this.isMinimized;

    if(this.isMinimized) {
      this.dialogRef.updateSize('auto', '');
    } else {
      this.dialogRef.updateSize('1700px', '95vh');
    }

    setTimeout(() => {
        if (this.dragInstance) {
          this.dragInstance.reset();
        }
      });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
