import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { SelectComponent } from './select/select.component';
import { DropDownComponent } from "./drop-down/drop-down.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HeaderComponent,
      SelectComponent, 
      RouterLink, DropDownComponent , 
     ]
})
export class AppComponent {
  items = ['Home', 'About', 'Contact'];
}
