import { Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ToolService } from './tool.service/tool.service';

@Component({
  selector: 'app-side-bar-left',
  imports: [MatIconModule, MatIconButton, MatIcon],
  templateUrl: './side-bar-left.html',
})
export class SideBarLeft implements OnInit {

  toolService = inject(ToolService);
  activeTool = 'select';
  drawColor = '#4447ef'

  showColorPicker = false;

  ngOnInit() {
    this.toolService.activeTool$.subscribe(tool => {
      this.activeTool = tool;
    });
  }

  selectTool(toolName: string) {
    this.toolService.setTool(toolName);

    if(toolName === 'draw') {
      this.showColorPicker = !this.showColorPicker;
    } else {
      this.showColorPicker = false;
    }
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.toolService.setDrawColor(color);
  }

}
