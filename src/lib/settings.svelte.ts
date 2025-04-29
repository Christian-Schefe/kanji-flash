import { browser } from "$app/environment";
import { storagePrefix } from "./localStorage.svelte";

type Settings = {
	settings: {
		font: string;
	};
};

const defaultSettings = {
	font: "noto-sans-jp",
};

export const settings: Settings = $state({
	settings: defaultSettings,
});
let hasLoaded = false;

export const mountSettings = () => {
	$effect(() => {
		if (!hasLoaded) {
			settings.settings = browser
				? JSON.parse(
						localStorage.getItem(`${storagePrefix}settings`) ?? "null",
					) || defaultSettings
				: defaultSettings;

			hasLoaded = true;
		}
	});

	$effect(() => {
		localStorage.setItem(
			`${storagePrefix}settings`,
			JSON.stringify(settings.settings),
		);
	});
};
