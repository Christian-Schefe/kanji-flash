import { browser } from '$app/environment';
import { allKanjiCollection } from './collection.svelte';
import { defaultFlashState, type FlashSettings, type FlashState } from './game/FlashSettings';
import { storagePrefix } from './localStorage.svelte';

type Settings = {
  settings: {
    font: string;
    gameModeSettings: {
      none: null;
      flash: FlashSettings;
    };
  };
};

type State = {
  state: {
    badKanjis: {
      [kanji: string]: number;
    };
    gameMode: 'none' | 'flash';
    gameModeState: {
      none: null;
      flash: FlashState;
    };
  };
};

const defaultSettings: Settings['settings'] = {
  font: 'noto-sans-jp',
  gameModeSettings: {
    none: null,
    flash: {
      collection: allKanjiCollection.id,
      mode: 'kanjiAndMeaning',
      review: false
    }
  }
};

const defaultState: State['state'] = {
  badKanjis: {},
  gameMode: 'none',
  gameModeState: {
    none: null,
    flash: defaultFlashState
  }
};

export const settings: Settings = $state({
  settings: defaultSettings
});

export const stateData: State = $state({
  state: defaultState
});

let hasSettingsLoaded = false;
let hasStateLoaded = false;

export const mountSettings = () => {
  const settingsKey = `${storagePrefix}settings`;
  const stateKey = `${storagePrefix}state`;
  $effect(() => {
    if (!hasSettingsLoaded) {
      settings.settings = browser
        ? JSON.parse(localStorage.getItem(settingsKey) ?? 'null') || defaultSettings
        : defaultSettings;

      hasSettingsLoaded = true;
    }
  });

  $effect(() => {
    if (!hasStateLoaded) {
      stateData.state = browser
        ? JSON.parse(localStorage.getItem(stateKey) ?? 'null') || defaultState
        : defaultState;

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
