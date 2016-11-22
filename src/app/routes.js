import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GameComponent} from './game';

@Component({
  selector: 'fountain-root',
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: GameComponent
  }
];

export const routing = RouterModule.forRoot(routes);
