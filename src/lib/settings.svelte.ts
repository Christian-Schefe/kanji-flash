import { browser } from "$app/environment";
import { storagePrefix } from "./localStorage.svelte";

type Settings = {
	settings: {
		font: string;
	};
};

type State = {
	state: {
		badKanjis: {
			[kanji: string]: number;
		};
	};
};

const defaultSettings = {
	font: "noto-sans-jp",
};

const defaultState = {
	badKanjis: {},
};

export const settings: Settings = $state({
	settings: defaultSettings,
});

export const state: State = $state({
	state: defaultState,
});

let hasSettingsLoaded = false;
let hasStateLoaded = false;

export const mountSettings = () => {
	const settingsKey = `${storagePrefix}settings`;
	const stateKey = `${storagePrefix}state`;
	$effect(() => {
		if (!hasSettingsLoaded) {
			settings.settings = browser
				? JSON.parse(localStorage.getItem(settingsKey) ?? "null") ||
					defaultSettings
				: defaultSettings;

			hasSettingsLoaded = true;
		}
	});

	$effect(() => {
		if (!hasStateLoaded) {
			state.state = browser
				? JSON.parse(localStorage.getItem(stateKey) ?? "null") || defaultState
				: defaultState;

			hasStateLoaded = true;
		}
	});

	$effect(() => {
		localStorage.setItem(settingsKey, JSON.stringify(settings.settings));
	});

	$effect(() => {
		localStorage.setItem(stateKey, JSON.stringify(state.state));
	});
};
