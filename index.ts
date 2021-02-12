import { Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, shareReplay } from "rxjs/operators";

console.clear();

const getPokemon$ = ajax(`https://pokeapi.co/api/v2/pokemon/pikachu`).pipe(
  map(res => res.response.name),
  // subscribedTo("getPokemon$"),
  shareReplay(1)
);

getPokemon$.subscribe(x => console.log("A", x));
getPokemon$.subscribe(x => console.log("B", x));
getPokemon$.subscribe(x => console.log("C", x));

setTimeout(() => {
  getPokemon$.subscribe(x => console.log("D", x));
}, 1000);
