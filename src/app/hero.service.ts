import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from 'src/types';
import {
  generateRandomName,
  generateRandomNumber,
  generateRandomAbilities,
} from './utils';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor() {}
  getAllHeros(): Hero[] {
    return [
      { name: 'first hero', age: 12, abilities: ['fly', 'fire'] },
      { name: 'second hero', age: 14, abilities: ['run', 'fly'] },
      { name: 'third hero', age: 16, abilities: ['eat snacks', 'read'] },
      { name: 'fourth hero', age: 120, abilities: ['kiss', 'die'] },
    ];
  }

  onAdd() {
    return new Observable<Hero>((observer) => {
      /* create new hero every after some time */
      let limit = 10;
      const interval = setInterval(() => {
        limit--;
        const hero: Hero = {
          name: generateRandomName(),
          age: generateRandomNumber(100),
          abilities: generateRandomAbilities(),
        };
        observer.next(hero);
        if (limit === 0) {
          clearInterval(interval);
        }
      }, 20);
    });
  }
}
