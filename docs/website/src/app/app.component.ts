import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mobile: boolean = false;
  public constructor(private titleService: Title ) {
    this.titleService.setTitle('Mechanical Squirrel');
  }
  ngOnInit() {
    if(window.screen.width <= 500) {
      this.mobile = true;
    }
  }
}
