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
  colors =['dark','yellow','green',];

  
  CreateLetters(el:any): void {
    console.log(this.letter);
    this.letters = [...this.letter];
  }
 
  changeColor(el:any): void {

    let color = el.target.getAttribute('data-color');

    switch (color){
      case 'dark':
        el.currentTarget.setAttribute('data-color', 'green');
        el.currentTarget.classList.add('mat-chip-green')
        el.currentTarget.classList.remove('mat-chip-dark')
        break;
      case 'green':
        el.currentTarget.setAttribute('data-color', 'yellow');
        el.currentTarget.classList.add('mat-chip-yellow')
        el.currentTarget.classList.remove('mat-chip-green')
        break;
      case 'yellow':
        el.currentTarget.setAttribute('data-color', 'dark');
        el.currentTarget.classList.add('mat-chip-dark')
        el.currentTarget.classList.remove('mat-chip-yellow')
        break;

    }





    el.currentTarget.classList.add('mat-chip-green')  }
}
