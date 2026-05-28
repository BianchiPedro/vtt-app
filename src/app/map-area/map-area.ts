import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-map-area',
  imports: [DragDropModule],
  templateUrl: './map-area.html',
})
export class MapArea {

  zoomLevel = 1;

  onWheel(event: WheelEvent) : void {
    
    if (event.deltaY > 0) {
      this.zoomLevel = Math.max(0.2, this.zoomLevel - 0.1); 
      
    } else if (event.deltaY < 0) {
      this.zoomLevel = Math.min(3, this.zoomLevel + 0.1); 
    }
    
    console.log('Nível do Zoom atual:', this.zoomLevel);
  }

  // --- Variáveis da Câmera ---
  panX = 0;
  panY = 0;
  isPanning = false;
  startX = 0;
  startY = 0;

  // --- Motor de Arraste (Pan) ---
  startPan(event: MouseEvent): void {
    // Só permite arrastar se for o botão do meio (1)
    if (event.button === 1) {
      event.preventDefault(); // Impede o navegador de mostrar aquele ícone estranho de scroll
      this.isPanning = true;
      // Calcula a diferença entre onde o mouse está e onde o mapa já estava
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
    }
  }

  pan(event: MouseEvent): void {
    // Só atualiza a posição se estiver segurando o botão do meio
    if (this.isPanning) {
      this.panX = event.clientX - this.startX;
      this.panY = event.clientY - this.startY;
    }
  }

  endPan(event: MouseEvent): void {
    if (event.button === 1) {
      this.isPanning = false;
    }
  }
}
