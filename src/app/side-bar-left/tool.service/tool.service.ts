import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private activeToolSource = new BehaviorSubject<string>('select');
  
  activeTool$ = this.activeToolSource.asObservable();

  setTool(toolName: string) {
    this.activeToolSource.next(toolName);
  }
}