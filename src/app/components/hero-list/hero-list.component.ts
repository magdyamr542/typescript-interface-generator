import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HeroService } from 'src/app/hero.service';
import { InterfaceGeneratorService } from 'src/app/interface-generator.service';
import { Hero } from 'src/types';

@Component({
  selector: 'app-hero-list',
  template: `
    <div class="heroListContainer">
      <app-hero
        *ngFor="let hero of this.heros"
        [name]="hero.name"
        [age]="hero.age"
        [abilities]="hero.abilities"
      ></app-hero>
    </div>
  `,
})
export class HeroListComponent implements OnInit {
  heros: Hero[] = [];
  heroObser: Observable<string> = new Observable();

  constructor(
    private _heroService: HeroService,
    private _interfaceGen: InterfaceGeneratorService
  ) {}

  ngOnInit(): void {
    this.heros = this._heroService.getAllHeros();
    this._heroService.onAdd().subscribe((hero: Hero) => {
      console.log('got new hero');

      this.heros = [...this.heros, hero];
    });
  }
}
