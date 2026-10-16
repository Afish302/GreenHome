import { AlpineComponent } from "alpinejs";

type CounterDataOutput = {
  count: number;
  increment: () => void;
};

export default function (): AlpineComponent<CounterDataOutput> {
    return {
        init() {
            console.log("counter init");
        },
        count: 0,
        increment() {
            this.count++;
        },
    }
}
