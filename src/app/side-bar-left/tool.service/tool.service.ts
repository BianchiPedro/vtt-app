import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private activeToolSource = new BehaviorSubject<string>('select');
  activeTool$ = this.activeToolSource.asObservable();

  private drawColorSource = new BehaviorSubject<string>('#4447ef')
  drawColor$ = this.drawColorSource.asObservable();

  setTool(toolName: string) {
    this.activeToolSource.next(toolName);
  }

  setDrawColor(color: string) {
    this.drawColorSource.next(color)
  }
}