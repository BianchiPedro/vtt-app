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

  private toolService = inject(ToolService);
  activeTool = 'select';

  ngOnInit() {
    this.toolService.activeTool$.subscribe(tool => {
      this.activeTool = tool;
    });
  }

  selectTool(toolName: string) {
    this.toolService.setTool(toolName);
  }

}
