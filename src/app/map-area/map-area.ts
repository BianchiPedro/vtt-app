import { Component, ElementRef, ViewChild, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../side-bar-right/character-sheet-modal/character-sheet.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CharacterSheetModal } from '../side-bar-right/character-sheet-modal/character-sheet-modal';
import { ToolService } from '../side-bar-left/tool.service/tool.service';

interface Token {
  tokenId: number;
  characterId: number;
  name: string;
  image: string | null;
  position: { x: number; y: number };
  size: number;
}

interface ResizeState {
  token: Token;
  initialSize: number;
  initialX: number;
  initialY: number;
}

@Component({
  selector: 'app-map-area',
  imports: [MatIconModule, CommonModule],
  templateUrl: './map-area.html',
})
export class MapArea implements OnInit, OnDestroy {

  private characterService = inject(CharacterService);
  private toolService = inject(ToolService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  currentTool = 'select';

  // ==========================================
  // CÂMERA (ZOOM / PAN)
  // ==========================================
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  isPanning = false;
  private panStartX = 0;
  private panStartY = 0;

  // ==========================================
  // TOKENS
  // ==========================================
  tokensNoMapa: Token[] = [];
  selectedTokens: Token[] = []; // SEMPRE um array. Nunca um objeto solto.

  // ==========================================
  // DRAG DE TOKEN(S)
  // ==========================================
  public isDraggingTokens = false;
  private dragOffsets = new Map<Token, { offsetX: number; offsetY: number }>();

  // ==========================================
  // RESIZE DE TOKEN(S)
  // ==========================================
  private isResizingTokens = false;
  private resizeStartDist = 0;
  private resizeInitialState: ResizeState[] = [];

  // ==========================================
  // CAIXA DE SELEÇÃO (marquee)
  // ==========================================
  isSelecting = false;
  selectStartX = 0;
  selectStartY = 0;
  selectEndX = 0;
  selectEndY = 0;

  get selectionBox() {
    return {
      left: Math.min(this.selectStartX, this.selectEndX),
      top: Math.min(this.selectStartY, this.selectEndY),
      width: Math.abs(this.selectEndX - this.selectStartX),
      height: Math.abs(this.selectEndY - this.selectStartY)
    };
  }

  ngOnInit() {
    this.characterService.characterImageUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id, imageUrl }) => {
        this.tokensNoMapa.forEach(token => {
          if (token.characterId === id) {
            token.image = imageUrl;
          }
        });
      });

    this.toolService.activeTool$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tool => {
        this.currentTool = tool;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // HELPER: converte coords de tela -> coords do mapa
  // ==========================================
  private screenToMap(clientX: number, clientY: number): { x: number; y: number } {
    const wrapper = this.mapContainer.nativeElement.parentElement;
    const rect = wrapper.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.panX) / this.zoomLevel,
      y: (clientY - rect.top - this.panY) / this.zoomLevel
    };
  }

  // ==========================================
  // ZOOM
  // ==========================================
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

  // ==========================================
  // MOUSE DOWN — decide entre pan, seleção (marquee) ou nada
  // Disparado apenas quando clica no FUNDO do mapa (não em um token,
  // pois startTokenDrag/startTokenResize chamam stopPropagation antes)
  // ==========================================
  onMouseDown(event: MouseEvent): void {
    if (event.button === 1) {
      event.preventDefault();
      this.isPanning = true;
      this.panStartX = event.clientX - this.panX;
      this.panStartY = event.clientY - this.panY;
      return;
    }

    if (event.button === 0 && this.currentTool === 'select') {
      // Clique no fundo do mapa limpa a seleção e inicia o marquee
      this.selectedTokens = [];
      this.isSelecting = true;

      const mapPos = this.screenToMap(event.clientX, event.clientY);
      this.selectStartX = mapPos.x;
      this.selectStartY = mapPos.y;
      this.selectEndX = mapPos.x;
      this.selectEndY = mapPos.y;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      this.panX = event.clientX - this.panStartX;
      this.panY = event.clientY - this.panStartY;
      return;
    }

    if (this.isDraggingTokens) {
      const mapPos = this.screenToMap(event.clientX, event.clientY);
      this.dragOffsets.forEach((offset, token) => {
        token.position.x = mapPos.x - offset.offsetX;
        token.position.y = mapPos.y - offset.offsetY;
      });
      return;
    }

    if (this.isResizingTokens) {
      this.applyResize(event.clientX, event.clientY);
      return;
    }

    if (this.isSelecting) {
      const mapPos = this.screenToMap(event.clientX, event.clientY);
      this.selectEndX = mapPos.x;
      this.selectEndY = mapPos.y;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (event.button === 1) {
      this.isPanning = false;
    }

    if (event.button === 0) {
      if (this.isSelecting) {
        this.finishSelection();
      }
      this.isDraggingTokens = false;
      this.isResizingTokens = false;
      this.dragOffsets.clear();
      this.resizeInitialState = [];
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedTokens.length > 0) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      this.tokensNoMapa = this.tokensNoMapa.filter(t => !this.selectedTokens.includes(t));
      this.selectedTokens = [];
    }
  }

  private finishSelection(): void {
    this.isSelecting = false;

    const box = this.selectionBox;
    const minX = box.left;
    const maxX = box.left + box.width;
    const minY = box.top;
    const maxY = box.top + box.height;

    this.selectedTokens = this.tokensNoMapa.filter(token => {
      const tokenLeft = token.position.x;
      const tokenRight = token.position.x + token.size;
      const tokenTop = token.position.y;
      const tokenBottom = token.position.y + token.size;

      return tokenRight > minX && tokenLeft < maxX && tokenBottom > minY && tokenTop < maxY;
    });
  }

  // ==========================================
  // DROP DA SIDEBAR (criação de novo token)
  // ==========================================
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const dataString = event.dataTransfer?.getData('application/JSON');
    if (!dataString) return;

    const character = JSON.parse(dataString);
    const mapPos = this.screenToMap(event.clientX, event.clientY);
    const size = 60;

    this.tokensNoMapa.push({
      tokenId: Date.now() + Math.random(),
      characterId: character.id,
      name: character.name,
      image: character.characterImage,
      position: { x: mapPos.x - size / 2, y: mapPos.y - size / 2 },
      size
    });
  }

  // ==========================================
  // DRAG DE TOKEN(S)
  // ==========================================
  startTokenDrag(event: MouseEvent, token: Token): void {
    if (event.button !== 0) return;
    event.stopPropagation();

    // Se o token clicado não está na seleção atual, a seleção passa a ser só ele
    if (!this.selectedTokens.includes(token)) {
      this.selectedTokens = [token];
    }

    const mapPos = this.screenToMap(event.clientX, event.clientY);

    this.dragOffsets.clear();
    this.selectedTokens.forEach(t => {
      this.dragOffsets.set(t, {
        offsetX: mapPos.x - t.position.x,
        offsetY: mapPos.y - t.position.y
      });
    });

    this.isDraggingTokens = true;
  }

  // ==========================================
  // RESIZE DE TOKEN(S) — escala o grupo selecionado mantendo o centro de cada um
  // ==========================================
  startTokenResize(event: MouseEvent, token: Token): void {
    if (event.button !== 0) return;
    event.stopPropagation();

    if (!this.selectedTokens.includes(token)) {
      this.selectedTokens = [token];
    }

    this.resizeInitialState = this.selectedTokens.map(t => ({
      token: t,
      initialSize: t.size,
      initialX: t.position.x,
      initialY: t.position.y
    }));

    const mapPos = this.screenToMap(event.clientX, event.clientY);
    const centerX = token.position.x + token.size / 2;
    const centerY = token.position.y + token.size / 2;
    const dx = mapPos.x - centerX;
    const dy = mapPos.y - centerY;
    this.resizeStartDist = Math.sqrt(dx * dx + dy * dy) || 1; // evita divisão por zero

    this.isResizingTokens = true;
  }

  private applyResize(clientX: number, clientY: number): void {
    if (this.resizeInitialState.length === 0) return;

    // Usamos o token "âncora" (o que foi clicado primeiro) para calcular a proporção
    const anchor = this.resizeInitialState[0];
    const mapPos = this.screenToMap(clientX, clientY);

    const anchorCenterX = anchor.initialX + anchor.initialSize / 2;
    const anchorCenterY = anchor.initialY + anchor.initialSize / 2;
    const dx = mapPos.x - anchorCenterX;
    const dy = mapPos.y - anchorCenterY;
    const currentDist = Math.sqrt(dx * dx + dy * dy);

    const targetAnchorSize = Math.max(30, Math.min(800, anchor.initialSize * (currentDist / this.resizeStartDist)));
    const ratio = targetAnchorSize / anchor.initialSize;

    this.resizeInitialState.forEach(state => {
      const scaledSize = Math.max(20, state.initialSize * ratio);
      const newX = state.initialX + (state.initialSize - scaledSize) / 2;
      const newY = state.initialY + (state.initialSize - scaledSize) / 2;

      state.token.size = scaledSize;
      state.token.position.x = newX;
      state.token.position.y = newY;
    });
  }

  // ==========================================
  // ABRIR FICHA DO PERSONAGEM
  // ==========================================
  openTokenSheet(event: MouseEvent, token: Token): void {
    event.stopPropagation();

    const fullSheet = this.characterService.getCharacterById(token.characterId);

    if (fullSheet) {
      this.dialog.open(CharacterSheetModal, {
        hasBackdrop: true,           // <- ESSENCIAL: isola cliques do mapa
        width: '1700px',
        height: '95vh',
        maxWidth: '95vw',
        maxHeight: '95vh',
        panelClass: 'custom-vtt-dialog',
        data: fullSheet
      });
    } else {
      console.warn('Ficha não encontrada no banco de dados para o ID:', token.characterId);
    }
  }
}