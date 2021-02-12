import { Observable, Subscription } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, shareReplay } from "rxjs/operators";

console.clear();

const getPokemon$ = ajax(`https://pokeapi.co/api/v2/pokemon/pikachu`).pipe(
  map(res => res.response.name),
  subscribedTo("getPokemon$"),
  shareReplay(1)
);

getPokemon$.subscribe(x => console.log("A", x));
getPokemon$.subscribe(x => console.log("B", x));
getPokemon$.subscribe(x => console.log("C", x));

setTimeout(() => {
  getPokemon$.subscribe(x => console.log("D", x));
}, 1000);

/*
  RxJS operators are functions
 */
function subscribedTo<T>(name: string) {
  return (source: Observable<T>) => {
    let total = 0;
    let count = 0;

    /*
      Operator functions has to return a new observable. 
     */
    return new Observable<T>(observer => {
      count++;
      total++;

      console.log(
        `Observable "${name}" has been subscribed to ${total} time(s), and there are ${count} active subscriptions.`
      );

      const sub: Subscription = source.subscribe({
        next: v => observer.next(v),
        complete: () => {
          console.log(`Observable "${name}" has completed.`);
          total = 0;
          count = 0;
          observer.complete();
        }
      });

      return () => {
        if (count < 0) {
          count--;
        }

        console.log(
          `unsubscribed from "${name}", there are ${count} active subscribers left`
        );
        sub.unsubscribe();
      };
    });
  };
}
