import { browser } from '$app/environment';

type Settings = {
  settings: {
    font: string;
  };
};

const defaultSettings = {
  font: 'noto-sans-jp'
};

export const settings: Settings = $state({
  settings: defaultSettings
});
let hasLoaded = false;

export const mountSettings = () => {
  $effect(() => {
    if (!hasLoaded) {
      settings.settings = browser
        ? JSON.parse(localStorage.getItem('settings') ?? 'null') || defaultSettings
        : defaultSettings;

      hasLoaded = true;
    }
  });

  $effect(() => {
    localStorage.setItem('settings', JSON.stringify(settings.settings));
  });
};
