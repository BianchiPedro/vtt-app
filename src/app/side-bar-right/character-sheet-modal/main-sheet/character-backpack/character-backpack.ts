import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BackpackItem } from '../../character-model';

@Component({
  selector: 'app-character-backpack',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-backpack.html',
})
export class CharacterBackpack {

  backpackData: BackpackItem[] = Array.from({ length: 36 }, () => ({ item: '', qtd: 0}));

  exportBackpackData() {
    return {
      dados: this.backpackData
    }
  }
}
