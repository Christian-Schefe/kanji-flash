import { GameHandler } from './GameHandler.svelte';

type FlashSettings = {
  collection: string;
};
class FlashGameHandler extends GameHandler<FlashSettings> {
  getDefaultSettings(): FlashSettings {
    return {
      collection: 'jouyou'
    };
  }
  startGame(settings: FlashSettings): void {}
}
