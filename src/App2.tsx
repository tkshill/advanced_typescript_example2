import { useEffect, useReducer } from "react";
import "./styles.css";

// Domain

type State = "Initial" | "Loading" | FetchedPokemon;
type FetchedPokemon = { type: "FetchedPokemon"; value: string };

type Action = RandomPokemonRequested | PokemonReturned;
type RandomPokemonRequested = { type: "RandomPokemonRequested" };
type PokemonReturned = { type: "PokemonReturned"; value: string };

// Helper funcs
function getRandomId() {
  return Math.floor(Math.random() * 251) + 1;
}

// Init
const initialState: State = "Initial";

async function fetchPokemon(): Promise<string> {
  const rand_id = getRandomId();
  const res = await fetch(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rand_id}.png`
  )
    .then((r) => r.arrayBuffer())
    .then((ab) => URL.createObjectURL(new Blob([ab], { type: "image/jpeg" })));
  return await res;
}

// update / controller
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "RandomPokemonRequested":
      return "Loading";
    case "PokemonReturned":
      return { type: "FetchedPokemon", value: action.value };
  }
};

const createComp = (s: State) => {
  switch (s) {
    case "Loading":
      return <div>Loading</div>;
    case "Initial":
      return <div></div>;
    default:
      return (
        <div>
          <img src={s.value} alt="random pokemon"></img>
        </div>
      );
  }
};

// components
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function run() {
      switch (state) {
        case "Initial":
        case "Loading":
          const data = await fetchPokemon();
          dispatch({ type: "PokemonReturned", value: data });
      }
    }
    run();
  }, [state]);

  // views

  return (
    <div className="App">
      <h1>Who's that pokemon?!</h1>
      <button
        onClick={() => {
          dispatch({ type: "RandomPokemonRequested" });
        }}
      >
        Randomize
      </button>
      <h2>Click the button to get a new one.</h2>
      {createComp(state)}
    </div>
  );
}
