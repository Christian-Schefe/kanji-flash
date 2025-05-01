import type { Kanji } from "./types";

type RtkInfo = {
	kanji: string;
	keyword: string;
	index: number;
};

const parseRtkInfo = (csv: string): Map<string, RtkInfo> => {
	const lines = csv.split("\n").slice(1);
	const map = new Map<string, RtkInfo>();
	for (const line of lines) {
		if (!line.trim()) continue;
		const parts = line.split(",");
		const kanji = parts[0].trim();
		const index = Number.parseInt(parts[2].trim());
		const keyword = parts[4]?.trim();
		if (kanji && index && keyword) {
			map.set(kanji, { kanji, keyword, index });
		}
	}
	return map;
};

const validateInfo = (info: Map<string, RtkInfo>) => {
	const maxIndex = info.values().reduce((max, rtk) => {
		if (rtk.index > max) {
			return rtk.index;
		}
		return max;
	}, 0);
	console.log("max index:", maxIndex, info.size);
	const arr = new Array(maxIndex + 1);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = null;
	}
	for (const data of info.values()) {
		if (arr[data.index]) {
			console.error("Duplicate index:", data.index, data);
			continue;
		}
		arr[data.index] = data;
	}
	for (let i = 1; i < arr.length; i++) {
		if (!arr[i]) {
			console.error("Missing index:", i);
		}
	}
	console.log("RTK info validation complete");
};

export const addRtkInfo = (csv: string, kanjis: Kanji[]) => {
	const rtkInfo = parseRtkInfo(csv);
	validateInfo(rtkInfo);
	console.log(rtkInfo.size);
	for (const kanji of kanjis) {
		const rtk = rtkInfo.get(kanji.l);
		if (rtk) {
			kanji.r = {
				k: rtk.keyword,
				i: rtk.index,
			};
		}
	}
	return kanjis;
};
