import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RelationsData } from '../../character-model';

@Component({
  selector: 'app-character-relations',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-relations.html',
})
export class CharacterRelations {

  relationsData: RelationsData = {
    // 10 linhas de laços (banco de dados visual da esquerda e meio)
    lacos: Array.from({length: 10}, () => ({ nome: '', laco: '', niv: 0})),

    // 5 linhas de promessas (banco de dados visual de baixo)
    promessas: Array.from({ length: 5}, () => ({
      descricao: '',
      progresso: [false, false, false] // As 3 checkbox de progresso da promessa
    }))
  };

  exportRelationsData() {
    return {
      dados: this.relationsData
    }
  }
}
