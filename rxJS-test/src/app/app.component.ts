import { Component } from '@angular/core';
import { ConnectionService } from './services/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'rxJS-test';

  constructor(private connService: ConnectionService) {

    //CHIAMATE SINGOLE

    connService.getDittoWithPromise().then(ditto => console.log(ditto))
    // connService.getDittoWithObservable().subscribe(ditto => console.log(ditto))

    connService.getDittoWithObservable().subscribe({
      // next: ditto => console.log(ditto),
      // error: err => console.log(err)
      //sintassi alternativa
      next: console.log,
      error: console.log
      //funziona ugualmente perchè l'unico dato che mi arriva è quello, specificarlo è un più
    })

    //CHIAMATE PARALLELE

    connService.getFirst20PokemonWithPromise().then(pokemons => console.log('first 20 pk with fetch: ', pokemons))

    connService.getFirst20PokemonWithObservables().subscribe({
      next: pokemons => console.log('first 20 pk with observables', pokemons),
      error: err => console.log(err)
    })

    //CHIAMATE SEQUENZIALI

    connService.getFirstAbilityOfDittoPromise().then(ability => console.log('abilità: ', ability.name))

    connService.getFirstAbilityOfDittoObservable().subscribe({
      next: ability => console.log('abilità: ', ability.name),
      error: err => console.log(err)
    })

  }

}
