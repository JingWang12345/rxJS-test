import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Pokemon } from '../model/pokemon';
import { Ability } from '../model/ability';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  readonly DITTO_URL = 'https://pokeapi.co/api/v2/pokemon/ditto';

  readonly POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {
    this.getDittoWithPromise()
    this.getDittoWithObservable()
    this.getFirst20PokemonWithPromise()
  }

  // getDittoWithPromise(): void {
  //   fetch(this.DITTO_URL)
  //     .then(resp => resp.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.log(error))
  // }

  getDittoWithPromise(): Promise<Pokemon> {
    return fetch(this.DITTO_URL).then(resp => resp.json() as unknown as Pokemon)
    //questa è la conversione in Pokemon nella fetch
  }

  // getDittoWithObservable(): void {
  //   // this.http.get(this.DITTO_URL).subscribe(ditto => console.log(ditto))
  //   // otra versiòn, hermano
  //   this.http.get(this.DITTO_URL).subscribe({
  //     next: ditto => console.log('ditto with observable', ditto),
  //     error: err => console.log('està uno errores amigo', err)
  //   })
  // }

  getDittoWithObservable(): Observable<Pokemon> {
    // this.http.get(this.DITTO_URL).subscribe(ditto => console.log(ditto))
    // otra versiòn, hermano
    return this.http.get<Pokemon>(this.DITTO_URL);
    // mettere <Pokemon> dopo get lo TRASFORMO nella mia interfaccia Pokemon
  }

  //CHIAMATE IN PARALLELO

  getFirst20PokemonWithPromise(): Promise<any[]> {
    const fetchArr = [];
    for (let i = 1; i < 21; i++) {
      const url = this.POKEMON_URL + '/' + i + '/';
      const request = fetch(url).then(resp => resp.json());
      fetchArr.push(request)
    }
    return Promise.all(fetchArr)
  }

  getFirst20PokemonWithObservables(): Observable<Pokemon[]> {
    const getArr = [];
    for (let i = 1; i < 21; i++) {
      const url = this.POKEMON_URL + '/' + i + '/';
      const request = this.http.get<Pokemon>(url);
      getArr.push(request)
    }
    return forkJoin(getArr)
  }

  //CHIAMATE SEQUENZIALI

  getFirstAbilityOfDittoPromise(): Promise<any> {
    return fetch(this.DITTO_URL)
      .then(resp => resp.json())
      .then(ditto => {
        const abilitiesArr = ditto.abilities;
        const firstAbilityInfo = abilitiesArr[0];
        const firstAbility = firstAbilityInfo.ability;
        const abilityUrl = firstAbility.url;
        return fetch(abilityUrl).then(resp => resp.json())
      })
  }

  getFirstAbilityOfDittoObservable(): Observable<Ability> {
    return this.http.get<Pokemon>(this.DITTO_URL).pipe(
      switchMap((ditto) => {
        const abilitiesArr = ditto.abilities;
        const firstAbilityInfo = abilitiesArr[0];
        const firstAbility = firstAbilityInfo.ability;
        const abilityUrl = firstAbility.url;
        return this.http.get<Ability>(abilityUrl)
      })
    )
  }

  //CHIAMATA SEQUENZIALE + PARALLELO

  getAllPokemonsWithPromise() {
    return fetch(this.POKEMON_URL)
      .then(resp => resp.json())
      .then(pokemons => {
        const results = pokemons.results;
        const fetchArr = [];
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const request = fetch(result.url).then(resp => resp.json())
          fetchArr.push(request)
        }
        return Promise.all(fetchArr);
      })
  }

  getAllPokemonsWithObservable(): Observable<Pokemon[]> {
    return this.http.get<any>(this.POKEMON_URL).pipe(  //così funziona la tipizzazione ma per essere più preciso potrei creare un modello del json da /pokemon
      switchMap(pokemons => {
        const results = pokemons.results;
        const getArr = [];
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const request = this.http.get<Pokemon>(result.url)
          getArr.push(request)
        }
        return forkJoin(getArr)
      })
    )
  }

}
