import { CdkDragHandle, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-character-image',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './character-image.html',
})
export class CharacterImage {
  
  characterImage: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.characterImage = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  exportCharacterImage() {
    return this.characterImage;
  }
}
