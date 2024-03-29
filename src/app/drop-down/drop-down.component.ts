import { Component } from '@angular/core';
import { DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [DropdownModule,FormsModule ],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css'
})
export class DropDownComponent {

  options = [{"name":"imad" , "value":1}]
  selectedCity = '';

}
