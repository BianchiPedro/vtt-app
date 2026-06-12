import { CdkDragHandle, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { StatusData } from '../../character-model';

@Component({
  selector: 'app-character-status',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-status.html',
})
export class CharacterStatus {

  statusData: StatusData = {
    mente: {
      niveis: Array.from({ length: 16}, () => ({valor: '', mod: 0})),
      base: 0,
      total: 0,
    },
    corpo: {
      niveis: Array.from({ length: 16}, () => ({valor: '', mod: 0})),
      base: 0,
      total: 0,
    },
    espirito: {
      niveis: Array.from({ length: 16}, () => ({valor: '', mod: 0})),
      base: 0,
      total: 0,
    }
  }

  exportStatusData() {
    return {
      dados: this.statusData
    };
  }
}
