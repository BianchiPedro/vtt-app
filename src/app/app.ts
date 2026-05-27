import { Component, signal } from '@angular/core';
import { MapArea } from "./map-area/map-area";
import { SideBarLeft } from "./side-bar-left/side-bar-left";
import { SideBarRight } from "./side-bar-right/side-bar-right";

@Component({
  selector: 'app-root',
  imports: [SideBarLeft, SideBarRight, MapArea],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vtt-app');
}
