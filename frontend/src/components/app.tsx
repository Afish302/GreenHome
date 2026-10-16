import alpineLogo from "/alpinejs-logo.svg";
import kitaLogo from "/kitajs.png";
import viteLogo from "/vite.svg";
import jsxLogo from "/jsx.png";
import { Counter } from "$/components/counter";

export function App() {
    const readDoccs = new Intl.ListFormat("en", {
      style: "long",
      type: "disjunction",
    }).format(["vite", "jsx / tsx", "alpinejs", "kitajs"]);

  return (
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src={jsxLogo} class="logo vanilla" alt="TSX logo" />
      </a>
      <a href="https://alpinejs.dev/start-here" target="_blank">
        <img
          src={alpineLogo}
          class="logo"
          alt="Alpine logo"
        />
      </a>
      <a href="https://kitajs.org/html/configuration" target="_blank">
        <img src={kitaLogo} class="logo" alt="Kitajs HTML logo" />
      </a>
      <h1>ViTA aka Vite + TSX + Alpine.js</h1>
      <div class="card">
        <Counter />
      </div>
      <p class="read-the-docs">Click on the {readDoccs} logos to learn more</p>
    </div>
  );
}
