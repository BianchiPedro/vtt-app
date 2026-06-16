import { CdkDragHandle, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CharacterService } from '../../character-sheet.service';

@Component({
  selector: 'app-character-image',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-image.html',
})
export class CharacterImage {
  
  @Input() characterId: number | null = null;
  
  characterImage: string | null = null;
  private characterService = inject(CharacterService);

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.characterImage = e.target.result;
        // Sincronizar imagem em tempo real com o serviço
        if (this.characterId !== null && this.characterImage) {
          this.characterService.updateCharacterImage(this.characterId, this.characterImage);
        }
      };

      reader.readAsDataURL(file);
    }
  }

  exportCharacterImage() {
    return this.characterImage;
  }
}
