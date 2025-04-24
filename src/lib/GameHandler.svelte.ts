export abstract class GameHandler<T> {
    abstract getDefaultSettings(): T;
	abstract startGame(settings: T): void;
}
