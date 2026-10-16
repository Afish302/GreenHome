export function Counter() {
    return (
        <button x-data="counter" x-on:click="increment">
            <span>Counter:</span>
            <span x-text="count" />
        </button>
    )
}