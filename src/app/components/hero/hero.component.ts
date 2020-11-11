import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  template: `
    <div class="hero">
      <h3>hero</h3>
      <p>name : {{ name }}</p>
      <p>age : {{ age }}</p>
      <p>abilites : {{ abilities | arrayOfStrings }}</p>
      <input type="text" [(ngModel)]="name" />
    </div>
  `,
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  @Input() name: string;
  @Input() age: string;
  @Input() abilities: string[];

  constructor() {}

  ngOnInit(): void {}
}
