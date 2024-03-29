import { Component } from '@angular/core';
import { SelectComponent } from '../select/select.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SelectComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  items = ['Home', 'About', 'Contact'];

}
