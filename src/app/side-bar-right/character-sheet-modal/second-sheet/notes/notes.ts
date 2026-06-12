import { CdkDragHandle, CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notes',
  imports: [CommonModule, FormsModule, MatIconModule, CdkDragHandle, CdkDrag],
  templateUrl: './notes.html',
})
export class Notes {

  exportNoteData() {
    return this.pages;
  }

  activePageId = 1;
  editTabId: number | null = null;

  pages = [
    { id: 1, name: '1º', content: ''},
    { id: 2, name: '2º', content: ''},
    { id: 3, name: '3º', content: ''},
  ];

  showContextMenu = false;
  menuX = 0;
  menuY = 0;
  targetPageId: number | null = null;

  openMenu(event: MouseEvent, pageId: number) {
    event.preventDefault();
    this.showContextMenu = true;
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.targetPageId = pageId;
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    this.showContextMenu = false;
  }
  
  startRename() {
    this.editTabId = this.targetPageId;
    this.showContextMenu = false;
  }

  saveName() {
    this.editTabId = null;
  }

  createPage() {
    const newId = this.pages.length > 0 ? Math.max(...this.pages.map(p => p.id)) + 1 : 1;
    this.pages.push({ id: newId, name: `${newId}`, content: ''});

    this.activePageId = newId;
    this.showContextMenu = false;
  }

  deletePage() {
    if (this.targetPageId) {
      this.pages = this.pages.filter(p => p.id != this.targetPageId);

      if (this.activePageId === this.targetPageId) {
        this.activePageId = this.pages.length > 0 ? this.pages[0].id : 0;
      }
    }
    this.showContextMenu = false;
  }

  getActiveContent(): string {
    const page = this.pages.find(p => p.id === this.activePageId);
    return page ? page.content : '';
  }

  setActiveContent(newText: string) {
    const page = this.pages.find(p => p.id === this.activePageId);
    if (page) {
      page.content = newText;
    }
  }
}
