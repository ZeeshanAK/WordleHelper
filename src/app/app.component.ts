import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WordleHelper';
  filteredWords = ['Here', 'We', 'Go', 'Kids', 'Move', 'To', 'The', 'Group','....', 'Dummy' ,'List', 'For', 'Now'];
  letters : string[] = [];
  letter:string = '';

  
  CreateLetters(el:any): void {
    console.log(this.letter);
    this.letters = [...this.letter];
  }
}
