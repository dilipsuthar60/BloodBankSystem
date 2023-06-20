import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blood-bank-system';
}

import {
    Input,
    Ripple,
    initTE,
  } from "tw-elements";
  
  initTE({ Input, Ripple });