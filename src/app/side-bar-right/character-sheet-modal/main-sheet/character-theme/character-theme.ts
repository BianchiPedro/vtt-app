import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ThemeData } from '../../character-model';

@Component({
  selector: 'app-character-theme',
    imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag, MatSelectModule, MatFormFieldModule],
  templateUrl: './character-theme.html',
})
export class CharacterTheme {

  themeData: ThemeData = {
    nomeTema: '',
    aspectos: Array.from({ length: 6}, () => ({nome: '', mod: 0})),
    habilidadesClasse: Array.from({ length: 6}, () => ({mod: 0, habilidades: []})),
    defeitos: Array.from({ length: 4 }, () => ({nome: '', mod: 0})),
    treinos: Array.from({ length: 4}, () => ({nome: '', sa: 0, sn: 0})),
    objetivo: '',
    abandono: [false, false, false, false, false],
    avanco: [false, false, false, false, false]
  };

  modValues: number[]=[0,0,0,0,0,0]

  getIconbyMod(valor: number): string {
    const iconMap: {[key:number]: string} = {
      1: 'eco',
      2: 'hardware',
      3: 'swords',
      4: 'castle',
      5: 'crown',
      6: 'flare'
    }

    return iconMap[valor] || 'horizontal_rule';
  }

  listaHabilidadesDisponiveis = [
    'Rapidez',
    'Poderoso',
    'Reliquário',
    'Sortudo',
    'Maestria',
    'Duplicidade',
    'Defensivo'
  ];

  habilidadesSelecionadas: string[][] = [
    [], [], [], [], [], []
  ];

  exportThemeData() {

    this.themeData.aspectos.forEach((aspecto, i) => {
      this.themeData.habilidadesClasse[i].mod = aspecto.mod;
    })

    return this.themeData;
  }
}
