import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar-left',
  imports: [MatIconModule, MatIconButton, MatIcon],
  templateUrl: './side-bar-left.html',
})
export class SideBarLeft {}
