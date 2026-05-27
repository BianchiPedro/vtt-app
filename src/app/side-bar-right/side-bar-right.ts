import { Component } from '@angular/core';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-side-bar-right',
  imports: [MatTabsModule, MatIcon],
  templateUrl: './side-bar-right.html',
})
export class SideBarRight {}
