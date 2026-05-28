import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-map-area',
  imports: [DragDropModule],
  templateUrl: './map-area.html',
})
export class MapArea {}
