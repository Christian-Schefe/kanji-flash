import { defaultFlashSettings, type FlashSettings } from './game/FlashSettings';
import { localStore, type LocalStore } from './localStorage.svelte';

export type GameModeStateByMode = {
  [M in GameMode]: () => GameModeSettings[M];
};

export type GameMode = 'none' | 'flash' | 'spacedRepetition';

export type GameModeSettings = {
  none: null;
  flash: FlashSettings;
  spacedRepetition: {};
};

export type GameModeState = {
  mode: GameMode;
  settings: GameModeSettings;
};

export const getGameModeSettingsStore: () => LocalStore<GameModeState> = () => {
  return localStore('gameModeSettings', {
    mode: 'none',
    settings: {
      none: null,
      flash: defaultFlashSettings,
      spacedRepetition: {}
    }
  });
};
