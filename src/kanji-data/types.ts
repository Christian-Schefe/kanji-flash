export type Kanji = {
	literal: string;
	strokes: number;
	frequency: number | null;
	jlpt: number | null;
	grade: number | null;
	rtk: {
		keyword: string;
		index: number;
	} | null;
	meanings: string[];
	kunReadings: string[];
	onReadings: string[];
};
