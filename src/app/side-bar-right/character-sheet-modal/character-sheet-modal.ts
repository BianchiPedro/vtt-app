import { Component } from '@angular/core';
import { CdkDrag } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-character-sheet-modal',
  imports: [CdkDrag],
  templateUrl: './character-sheet-modal.html',
})
export class CharacterSheetModal {}
