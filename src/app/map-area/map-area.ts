import { Component, ElementRef, ViewChild, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../side-bar-right/character-sheet-modal/character-sheet.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CharacterSheetModal } from '../side-bar-right/character-sheet-modal/character-sheet-modal';

@Component({
  selector: 'app-map-area',
  imports: [MatIconModule, CommonModule],
  templateUrl: './map-area.html',
})
export class MapArea implements OnInit, OnDestroy {

  dialog = inject(MatDialog)

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  zoomLevel = 1;
  panX = 0;
  panY = 0;
  isPanning = false;
  startX = 0;
  startY = 0;

  // Estado do drag de token
  draggingToken: any = null;
  dragOffsetX = 0; // Offset do clique dentro do token (em coords do mapa)
  dragOffsetY = 0;
  private characterService = inject(CharacterService);
  private destroy$ = new Subject<void>();
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const wrapper = this.mapContainer.nativeElement.parentElement;
    const rect = wrapper.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const oldZoom = this.zoomLevel;

    if (event.deltaY > 0) {
      this.zoomLevel = Math.max(0.2, this.zoomLevel - 0.1);
    } else {
      this.zoomLevel = Math.min(3, this.zoomLevel + 0.1);
    }

    const zoomFactor = this.zoomLevel / oldZoom;
    this.panX = mouseX - (mouseX - this.panX) * zoomFactor;
    this.panY = mouseY - (mouseY - this.panY) * zoomFactor;
  }

  startPan(event: MouseEvent): void {

    this.selectedToken = null;

    if (event.button === 1) {
      event.preventDefault();
      this.isPanning = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    // Pan do mapa
    if (this.isPanning) {
      this.panX = event.clientX - this.startX;
      this.panY = event.clientY - this.startY;
    }

    // Drag de token
    if (this.draggingToken) {
      const wrapper = this.mapContainer.nativeElement.parentElement;
      const rect = wrapper.getBoundingClientRect();

      // Converte posição do mouse para coordenadas do mapa
      const mapX = (event.clientX - rect.left - this.panX) / this.zoomLevel;
      const mapY = (event.clientY - rect.top - this.panY) / this.zoomLevel;

      // Subtrai o offset para o token não "pular" para o centro
      this.draggingToken.position.x = mapX - this.dragOffsetX;
      this.draggingToken.position.y = mapY - this.dragOffsetY;
    }
    // Resize do token
    if (this.resizingToken) {
      const wrapper = this.mapContainer.nativeElement.parentElement;
      const rect = wrapper.getBoundingClientRect();

      const mapX = (event.clientX - rect.left - this.panX) / this.zoomLevel;
      const mapY = (event.clientY - rect.top - this.panY) / this.zoomLevel;

      const centerX = this.resizingToken.position.x + this.resizingToken.size / 2;
      const centerY = this.resizingToken.position.y + this.resizingToken.size / 2;

      const dx = mapX - centerX;
      const dy = mapY - centerY;
      const currentDist = Math.sqrt(dx * dx + dy * dy);

      // Escala proporcional: novo tamanho = tamanho inicial * (distância atual / distância inicial)
      const newSize = Math.max(30, Math.min(200, 
        this.resizeStartSize * (currentDist / this.resizeStartDist)
      ));

      // Reposiciona para manter o centro fixo
      this.resizingToken.position.x = this.resizingToken.position.x 
        + (this.resizingToken.size - newSize) / 2;
      this.resizingToken.position.y = this.resizingToken.position.y 
        + (this.resizingToken.size - newSize) / 2;
      
      this.resizingToken.size = newSize;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (event.button === 1) this.isPanning = false;
    if (event.button === 0) {
      this.draggingToken = null;
      this.resizingToken = null; // <- adicione esta linha
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedToken) {
      
      // CADEADO DE SEGURANÇA: Verifica onde o cursor do mouse (foco) está.
      // Se estiver piscando dentro de um input ou textarea (como o chat ou ficha), aborta a deleção!
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return; 
      }

      // Filtra a lista, removendo o token que tem o mesmo ID do token selecionado
      this.tokensNoMapa = this.tokensNoMapa.filter(t => t.tokenId !== this.selectedToken.tokenId);
      
      // Limpa a memória de seleção
      this.selectedToken = null;
    }
  }

  // ==========================================
  // INICIALIZAÇÃO E LIFECYCLE
  // ==========================================
  ngOnInit() {
    // Se inscrever em atualizações de imagem de personagem
    this.characterService.characterImageUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id, imageUrl }) => {
        // Encontrar todos os tokens com este characterId e atualizar sua imagem
        this.tokensNoMapa.forEach(token => {
          if (token.characterId === id) {
            token.image = imageUrl;
          }
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // DROP DA SIDEBAR
  // ==========================================
  tokensNoMapa: any[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const dataString = event.dataTransfer?.getData('application/JSON');
    if (!dataString) return;

    const character = JSON.parse(dataString);
    const wrapper = this.mapContainer.nativeElement.parentElement;
    const rect = wrapper.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Converte para coordenadas do mapa, centralizando o token (60px / 2 = 30)
    const coordX = (mouseX - this.panX) / this.zoomLevel - 30;
    const coordY = (mouseY - this.panY) / this.zoomLevel - 30;

    this.tokensNoMapa.push({
      tokenId: Date.now() + Math.random(),
      characterId: character.id,
      name: character.name,
      image: character.characterImage,
      position: { x: coordX, y: coordY },
      size: 60  // <- tamanho inicial
    });
  }

  // ==========================================
  // DRAG DE TOKEN NO MAPA
  // ==========================================
  startTokenDrag(event: MouseEvent, token: any): void {

    // Só arrasta com botão esquerdo
    if (event.button !== 0) return;
    event.stopPropagation(); // Não inicia pan do mapa

    const wrapper = this.mapContainer.nativeElement.parentElement;
    const rect = wrapper.getBoundingClientRect();

    // Onde o mouse está no espaço do mapa
    const mapX = (event.clientX - rect.left - this.panX) / this.zoomLevel;
    const mapY = (event.clientY - rect.top - this.panY) / this.zoomLevel;

    // Offset = diferença entre onde o mouse clicou e a origem do token
    // Isso evita que o token "salte" para ter seu canto no cursor
    this.dragOffsetX = mapX - token.position.x;
    this.dragOffsetY = mapY - token.position.y;

    this.draggingToken = token;
    
    this.selectedToken = token;
  }

  // Estado do resize de token
resizingToken: any = null;
resizeStartDist = 0;  // distância inicial do handle ao centro (em coords do mapa)
resizeStartSize = 60; // tamanho inicial do token em px

startTokenResize(event: MouseEvent, token: any): void {
  if (event.button !== 0) return;
    event.stopPropagation(); // não inicia drag nem pan

    const wrapper = this.mapContainer.nativeElement.parentElement;
    const rect = wrapper.getBoundingClientRect();

    // Centro do token em coords do mapa
    const centerX = token.position.x + token.size / 2;
    const centerY = token.position.y + token.size / 2;

    // Posição do mouse em coords do mapa
    const mapX = (event.clientX - rect.left - this.panX) / this.zoomLevel;
    const mapY = (event.clientY - rect.top - this.panY) / this.zoomLevel;

    // Distância do mouse ao centro no momento do clique
    const dx = mapX - centerX;
    const dy = mapY - centerY;
    this.resizeStartDist = Math.sqrt(dx * dx + dy * dy);
    this.resizeStartSize = token.size;

    this.resizingToken = token;
    
    this.selectedToken = token;
}

  openTokenSheet(token: any) {
    const fullSheet = this.characterService.getCharacterById(token.characterId);

    if (fullSheet) {
      this.dialog.open(CharacterSheetModal, {
        hasBackdrop: false,
        width: '1700px',
        height: '95vh',
        maxWidth: '95vw',
        maxHeight: '95vh',
        panelClass: 'custom-vtt-dialog',
        data: fullSheet
      });
    } else {
      console.warn("Ficha não encontrada no banco de dados para o ID:", token.characterId);
    }
  }

  selectedToken: any = null;
}