import { CdkDragHandle, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SpellBook } from '../../character-model';

@Component({
  selector: 'app-spells',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './spells.html',
})
export class Spells {

  spellsData: SpellBook[] = Array.from({ length: 62}, () => ({school: '', form: '', niv: 0}));

  exportSpellsData() {
    return this.spellsData;
    
  }
}
