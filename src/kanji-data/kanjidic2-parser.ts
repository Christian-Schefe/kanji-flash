import { XMLParser } from "fast-xml-parser";
import type { Kanji } from "./types";

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "",
	preserveOrder: false,
	parseTagValue: false,
	parseAttributeValue: false,
	isArray: (_, jpath) => {
		return [
			"kanjidic2.character",
			"character.misc.stroke_count",
			"rmgroup.reading",
			"rmgroup.meaning",
		].includes(jpath);
	},
});

// Type guard helpers
const asArray = <T>(x: T | T[] | undefined): T[] => {
	if (x === undefined) return [];
	return Array.isArray(x) ? x : [x];
};

// biome-ignore lint/suspicious/noExplicitAny: no need to type this
const extractKanji = (char: any): Kanji => {
	const misc = char.misc || {};
	const readingMeaning = char.reading_meaning || {};
	const rmgroup = asArray(readingMeaning.rmgroup)[0] || {}; // Only first rmgroup usually matters
	const readings = asArray(rmgroup.reading);
	const meanings = asArray(rmgroup.meaning);

	return {
		l: char.literal,
		s: Number.parseInt(asArray(misc.stroke_count)[0]) || 0,
		f: misc.freq !== undefined ? Number.parseInt(misc.freq) : null,
		j: misc.jlpt !== undefined ? Number.parseInt(misc.jlpt) : null,
		g: misc.grade !== undefined ? Number.parseInt(misc.grade) : null,
		r: null,
		m: meanings
			.filter((m) => !m.m_lang || m.m_lang === "en")
			.map((m) => m["#text"] || m),
		k: readings
			.filter((r) => r.r_type === "ja_kun")
			.map((r) => r["#text"] || r),
		o: readings
			.filter((r) => r.r_type === "ja_on")
			.map((r) => r["#text"] || r),
	};
};

export const parseKanjis = (xml: string): Kanji[] => {
	const jsonObj = parser.parse(xml);
	const characters = asArray(jsonObj.kanjidic2.character);
	return characters.map(extractKanji);
};
