import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WordleHelper';
  box1: string = '';
  box2: string = '';
  box3: string = '';
  box4: string = '';
  box5: string = '';

  @ViewChild('input1', { static: true }) input1: ElementRef;
  @ViewChild('input2', { static: true }) input2: ElementRef;
  @ViewChild('input3', { static: true }) input3: ElementRef;
  @ViewChild('input4', { static: true }) input4: ElementRef;
  @ViewChild('input5', { static: true }) input5: ElementRef;
  myusername: string = '';
  constructor(
    input1: ElementRef,
    input2: ElementRef,
    input3: ElementRef,
    input4: ElementRef,
    input5: ElementRef
  ) {
    this.input1 = input1;
    this.input2 = input2;
    this.input3 = input3;
    this.input4 = input4;
    this.input5 = input5;
  }
  ngAfterViewInit() {
    this.input1.nativeElement.focus();
  }

  SubmitText(): void {
    let letter: String =
      this.box1 + this.box2 + this.box3 + this.box4 + this.box5;
    console.log(letter);
    //console.log(input5.letter);
  }
  crazy(event: any, ele: any): void {
    switch (ele.id) {
      case 'box1': {
        if (event.key == 'Backspace') {
          this.input1.nativeElement.focus();
        }
        break;
      }
      case 'box2': {
        if (event.key == 'Backspace') {
          this.input1.nativeElement.focus();
        }
        break;
      }
      case 'box3': {
        if (event.key == 'Backspace') {
          this.input2.nativeElement.focus();
        }
        break;
      }
      case 'box4': {
        if (event.key == 'Backspace') {
          this.input3.nativeElement.focus();
        }
        break;
      }
      case 'box5': {
        if (event.key == 'Backspace') {
          this.input4.nativeElement.focus();
        }
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
}
