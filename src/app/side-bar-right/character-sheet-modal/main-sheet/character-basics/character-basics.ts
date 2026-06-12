import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CharacterBasicsData } from '../../character-model';

@Component({
  selector: 'app-character-basics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-basics.html',
  styleUrl: './character-basics.css'
})
export class CharacterBasics {

  characterName = '';

  caracteristicasRotulos = ['Idade', 'Tamanho', 'Renome', 'Tesouro'];

  rotulosSelecionados: { [key: string]: string } = {
    'Idade': '',
    'Tamanho': '',
    'Renome': '',
    'Tesouro': ''
  };

  basicsData: CharacterBasicsData = {
    idade: '',
    tamanho: '',
    renome: '',
    tesouro: '',
    especie: '',
    agouro: '',
    alinhamento: '',
    titulos: ['', '', '', '', ''], // 5 linhas em branco para o HTML ler
    doms: ['', '', '', '', '']     // 5 linhas em branco para o HTML ler
  };

  exportBasicsData() {

    this.basicsData.idade = this.rotulosSelecionados['Idade'] || '';
    this.basicsData.tamanho = this.rotulosSelecionados['Tamanho'] || '';
    this.basicsData.renome = this.rotulosSelecionados['Renome'] || '';
    this.basicsData.tesouro = this.rotulosSelecionados['Tesouro'] || ''

    return {
      nome: this.characterName,
      dados: this.basicsData
    };
  }


  loadData(nome: string, dados: CharacterBasicsData) {
    this.characterName = nome;
    this.basicsData = dados;

    this.rotulosSelecionados['Idade'] = dados.idade || '';
    this.rotulosSelecionados['Tamanho'] = dados.tamanho || '';
    this.rotulosSelecionados['Renome'] = dados.renome || '';
    this.rotulosSelecionados['Tesouro'] = dados.tesouro || '';
  }

  // O mapa definitivo de opções e ícones para cada caixinha da ficha!
  bancoDeDadosRotulos: { [key: string]: { nome: string, icone: string }[] } = {
    'Idade': [
      { nome: 'Criança', icone: 'eco' },
      { nome: 'Jovem', icone: 'hardware' },
      { nome: 'Adulto', icone: 'swords' },
      { nome: 'Velho', icone: 'castle' },
      { nome: 'Ancião', icone: 'crown' },
      { nome: 'Ancestral', icone: 'flare' }
    ],
    'Tamanho': [
      { nome: 'Ínfimo', icone: 'eco' },
      { nome: 'Pequeno', icone: 'hardware' },
      { nome: 'Médio', icone: 'swords' },
      { nome: 'Grande', icone: 'castle' },
      { nome: 'Gigante', icone: 'crown' },
      { nome: 'Colossal', icone: 'flare' },
    ],
    'Renome': [
      { nome: 'Grupo', icone: 'eco' },
      { nome: 'Vila', icone: 'hardware' },
      { nome: 'Cidade', icone: 'swords' },
      { nome: 'Reino', icone: 'castle' },
      { nome: 'Continente', icone: 'crown' },
      { nome: 'Mundial', icone: 'flare' },
    ],
    'Tesouro': [
      { nome: 'Distituído', icone: 'eco' },
      { nome: 'Pobre', icone: 'hardware' },
      { nome: 'Confortável', icone: 'swords' },
      { nome: 'Rico', icone: 'castle' },
      { nome: 'Nobre', icone: 'crown' },
      { nome: 'Realeza', icone: 'flare' },
    ]
  };

  // Nova função de ícone que descobre qual categoria olhar antes de buscar o símbolo
  getIcone(categoria: string, escolhaUsuario: string): string {
    if (!escolhaUsuario) return '';
    
    const opcoesDaCategoria = this.bancoDeDadosRotulos[categoria];
    const itemencontrado = opcoesDaCategoria?.find(opt => opt.nome === escolhaUsuario);
    
    return itemencontrado ? itemencontrado.icone : '';
  }
}