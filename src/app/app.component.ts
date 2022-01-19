import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WordleHelper';
  box5: string = '';

  SubmitText():void{
    console.log('Here we go');
    console.log(this.box5)
  }
  
}
