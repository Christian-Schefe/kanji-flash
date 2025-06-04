import { browser } from '$app/environment';
import {
  defaultFlashSettings,
  defaultFlashState,
  type FlashSettings,
  type FlashState
} from './game/flash/FlashSettings';
import {
  defaultTimeAttackSettings,
  defaultTimeAttackState,
  type TimeAttackSettings,
  type TimeAttackState
} from './game/time-attack/TimeAttackSettings';
import { storagePrefix } from './localStorage.svelte';

export type GameMode = 'none' | 'flash' | 'timeAttack';

type Settings = {
  settings: {
    font: string;
    showStrokeOrder: boolean;
    gameModeSettings: {
      none: null;
      flash: FlashSettings;
      timeAttack: TimeAttackSettings;
    };
  };
};

type State = {
  state: {
    gameMode: GameMode;
    gameModeState: {
      none: null;
      flash: FlashState;
      timeAttack: TimeAttackState;
    };
  };
};

const defaultSettings: () => Settings['settings'] = () => ({
  font: 'noto-sans-jp',
  showStrokeOrder: true,
  gameModeSettings: {
    none: null,
    flash: defaultFlashSettings(),
    timeAttack: defaultTimeAttackSettings()
  }
});

const defaultState: () => State['state'] = () => ({
  badKanjis: {},
  gameMode: 'none',
  gameModeState: {
    none: null,
    flash: defaultFlashState(),
    timeAttack: defaultTimeAttackState()
  }
});

export const settings: Settings = $state({
  settings: defaultSettings()
});

export const stateData: State = $state({
  state: defaultState()
});

let hasSettingsLoaded = false;
let hasStateLoaded = false;

export const resetSettings = () => {
  settings.settings = defaultSettings();
  stateData.state = defaultState();
};

export const mountSettings = () => {
  const settingsKey = `${storagePrefix}settings`;
  const stateKey = `${storagePrefix}state`;
  $effect(() => {
    if (!hasSettingsLoaded) {
      settings.settings = browser
        ? JSON.parse(localStorage.getItem(settingsKey) ?? 'null') || defaultSettings()
        : defaultSettings();

      hasSettingsLoaded = true;
    }
  });

  $effect(() => {
    if (!hasStateLoaded) {
      stateData.state = browser
        ? JSON.parse(localStorage.getItem(stateKey) ?? 'null') || defaultState()
        : defaultState();

      hasStateLoaded = true;
    }
  });

  $effect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(settings.settings));
  });

  $effect(() => {
    localStorage.setItem(stateKey, JSON.stringify(stateData.state));
  });
};
