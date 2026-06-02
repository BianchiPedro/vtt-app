import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-character-basics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule], // Importante trazer esses módulos!
  templateUrl: './character-basics.html'
})
export class CharacterBasics {
  
  // Array para guardar as 4 escolhas do jogador (iniciam vazias)
  rotulosSelecionados = ['', '', '', ''];

  // O "Banco de Dados" das opções disponíveis e seus ícones do Material Icons
  opcoesRotulos = [
    { nome: 'Novato', icone: 'eco' },
    { nome: 'Aprendiz', icone: 'hardware' },
    { nome: 'Adepto', icone: 'swords' },
    { nome: 'Especialista', icone: 'castle' },
    { nome: 'Mestre', icone: 'crown' },
    { nome: 'Grão-mestre', icone: 'flare' }
  ];

  // Função que o HTML vai chamar para saber qual ícone desenhar
  getIcone(nomeSelecionado: string): string {
    const opcao = this.opcoesRotulos.find(opt => opt.nome === nomeSelecionado);
    return opcao ? opcao.icone : 'eco';
  }
}