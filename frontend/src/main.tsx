import { App } from '$/components/app';
import '$/styles/index.css';
import Alpine from 'alpinejs';

await import("$/components/counter/script").then((m) =>
  Alpine.data("counter", m.default)
);

window.Alpine = Alpine;

Alpine.start();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = String(<App />);
