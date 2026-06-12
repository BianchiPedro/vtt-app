// ==========================================
// SUB-INTERFACES (Os "Cartões" da Ficha)
// ==========================================

export interface CharacterBasicsData {
  idade: string;
  tamanho: string;
  renome: string;
  tesouro: string;
  especie: string;
  agouro: string;
  alinhamento: string;
  titulos: string[];
  doms: string[];
}

export interface BackpackItem {
  item: string;
  qtd: number | string;
}

export interface CharacterRelations {
  nome: string;
  laco: string;
  niv: number;
}

export interface CharacterPromise {
  descricao: string;
  progresso: boolean[]; // Array guardando quais checkboxes foram marcadas
}

export interface RelationsData {
  lacos: CharacterRelations[];
  promessas: CharacterPromise[];
}

export interface ThemeLine {
  nome: string;
  mod: number;
}

export interface ThemeSkillLine {
  mod: number;
  habilidades: string[]; // Aqui entram as seleções múltiplas do mat-select!
}

export interface ThemeStudyLine {
  nome: string;
  sa: number;
  sn: number;
}

export interface ThemeData {
  nomeTema: string;
  aspectos: ThemeLine[]; // Lista das 6 linhas
  habilidadesClasse: ThemeSkillLine[]; // Lista das 6 linhas com o select múltiplo
  defeitos: ThemeLine[];
  treinos: ThemeStudyLine[];
  objetivo: string;
  abandono: boolean[]; // As 6 checkboxes
  avanco: boolean[];   // As 6 checkboxes
}

export interface StatusColumn {
  niveis: { valor: string, mod: number }[]; // As 13 linhas da coluna
  base: number;   // Quadrado branco grande
  total: number;  // Quadrado colorido grande
}

export interface StatusData {
  mente: StatusColumn;
  corpo: StatusColumn;
  espirito: StatusColumn;
}

export interface NotePage {
  id: number;
  name: string;
  content: string;
}

// ==========================================
// INTERFACE PRINCIPAL (O Personagem Completo)
// ==========================================

export interface Character {
  id: number;
  type: string;          // 'Personagem', 'NPC', etc.
  name: string;      // O nome que dita a ficha
  
  // Alojando os cartões dentro do personagem
  basics: CharacterBasicsData;
  backpack: BackpackItem[];
  relations: RelationsData;
  status: StatusData;
  themes: ThemeData[];   // Array com os multiplos cartões de Tema da Ficha
  
  backgroundText: string; // O que for escrito no componente de Background
  notes: NotePage[];      // O caderno de abas
}