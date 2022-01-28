import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Letters } from './Letter';
import { HttpClient } from '@angular/common/http';
import { Notyf } from 'notyf';
import { NOTYF } from './notyf.token';
import { environment } from 'src/environments/environment';
import { domainToASCII } from 'url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient, @Inject(NOTYF) private notyf: Notyf) {}
  ngOnInit(): void {
    this.http
      .get(
        'https://raw.githubusercontent.com/ZeeshanAK/english-words/master/words_alpha.txt',
        { responseType: 'text' as 'json' }
      )
      .subscribe((data) => {
        this.filteredWordsOrignal = (<string>data).split(/\r?\n/);
      });
      console.log(environment.ping);
  }
  title = 'WordleHelper';
  filteredWordsOrignal: string[] = [];
  filteredWords: string[] = [];

  letters: Letters[] = [];
  letter: string = '';
  colors = ['dark', 'yellow', 'green'];

  CreateLetters(el: any): void {
    this.letters = [];
    [...this.letter].forEach((element) => {
      this.letters.push(new Letters(element, 'dark'));
    });
  }

  changeColor(el: any, index: number): void {
    if (this.filteredWordsOrignal.length == 0) {
      this.notyf.error(
        'Cannot fetch words right now. Please check back in a while. Thanks!'
      );
      return;
    }

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
    let yellowString: string = '';
    let regString: string = '';
    // [...this.letters].forEach((element) => {
    //   if (element.color == 'green') {
    //     regString += element.letter;
    //   } else if (element.color == 'yellow') {
    //     regString += '\\w';
    //   }
    // });

    //filter 2a

    let yellowLetters = this.letters
      .filter(function (el) {
        return el.color == 'yellow';
      })
      .map((a) => a.letter);
    let greenLetters = this.letters
      .filter(function (el) {
        return el.color == 'green';
      })
      .map((a) => a.letter);

      [...yellowLetters].forEach((element) => yellowString += `(?=.*${element})`);
 // [...this.letters].forEach((element) => {
    //   if (element.color == 'green') {
    //     regString += element.letter;
    //   } else if (element.color == 'yellow') {
    //     regString += '\\w';
    //   }
    // });


      yellowString += '.+'


      let yellos = new RegExp(yellowString);

      this.filteredWords = this.filteredWords.filter((letter) => yellos.test(letter));


    for(let i = 0; i <this.letters.length; i++ ){
      if (this.letters[i].color == 'green') {
        if(((i -1) >=0) &&  this.letters[i].color == 'green'){
          regString += `${this.letters[i].letter}`;
        } else{
          regString += `${this.getDots(i)}${this.letters[i].letter}`;
        }
      } 
      // else if (this.letters[i].color == 'yellow') {
      //   if(((i -1) >=0) &&  this.letters[i].color == 'yellow'){
      //     regString += `${this.letters[i].letter}`;
      //   } else{
      //     regString += `${this.getDots(i)}${this.letters[i].letter}`;
      //   }

      // }
    }

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
  getDots(count:number): string{
    if(count == 0){
      return '^'
    }
     let dots: string = '';
    for (var i = 0; i < count; i++) {
      dots += '.';
    }
    return dots;
  }
}
