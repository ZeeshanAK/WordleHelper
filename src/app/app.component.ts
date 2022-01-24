import { Component, ViewChild, ElementRef } from '@angular/core';
import { Letters } from './Letter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WordleHelper';
  filteredWordsOrignal = [
    'crazy',
    'crbzy',
    'crazyyyy',
    'arise',
    'arose',
    'arrrr',
    'happy',
    'ppahyyyyyy',
    '....',
    'Dummy',
    'Lists',
    'For',
    'Now',
  ];
  filteredWords: string[] = [];


  letters: Letters[] = [];
  letter: string = '';
  colors = ['dark', 'yellow', 'green'];

  CreateLetters(el: any): void {
    console.log(this.letter);
    this.letters = [];
    [...this.letter].forEach((element) => {
      this.letters.push(new Letters(element, 'dark'));
    });
  }

  changeColor(el: any, index:number): void {
    let color = this.letters[index].color;

    switch (color) {
      case 'dark':
        this.letters[index].color = 'green';
        el.currentTarget.classList.add('mat-chip-green');
        el.currentTarget.classList.remove('mat-chip-dark');
        break;
      case 'green':
        this.letters[index].color = 'yellow';
        el.currentTarget.classList.add('mat-chip-yellow');
        el.currentTarget.classList.remove('mat-chip-green');
        break;
      case 'yellow':
        this.letters[index].color = 'dark';
        el.currentTarget.classList.add('mat-chip-dark');
        el.currentTarget.classList.remove('mat-chip-yellow');
        break;
    }
    this.filteredWords = this.filteredWordsOrignal;

    // 1st filter - get only those letter whose length matches with what user typed
    this.filteredWords = this.filteredWords.filter(
      (letter) => letter.length == this.letter.length
    );


    // 2nd filter apply regex for Green and yellow letters
    let regString: string = '';
    [...this.letters].forEach((element) => {
      if (element.color == 'green') {
        regString += element.letter;
      } else if (element.color == 'yellow') {
        regString += '\\w';
      }
    });

    let re = new RegExp(regString);

    this.filteredWords = this.filteredWords.filter((letter) => re.test(letter));



    
    // 3rd  filter - Exclude words that shouldn't contain x y z letters
    let excludedLetter = this.letters
      .filter(function (el) {
        return el.color == 'dark';
      })
      .map((a) => a.letter);

    for (var i = 0; i < excludedLetter.length; i++) {
      this.filteredWords = this.filteredWords.filter(
        (letter) => !letter.includes(excludedLetter[i])
      );
    }
  }
}
