import axios from "axios";
import * as cheerio from "cheerio";

async function scrapeWikipediaTable(
	url: string,
	outputPath: string,
	tableIndex = 0,
): Promise<void> {
	try {
		// Fetch the HTML content of the Wikipedia page
		const { data: html } = await axios.get(url);

		// Load the HTML into Cheerio
		const $ = cheerio.load(html,{ dec: false });

		// Select the table element
		const tables = $("table.wikitable");

		if (tables.length === 0) {
			console.log("No tables found on the page.");
			return;
		}

		// Choose the table by index
		const table = tables.eq(tableIndex);

		const kanjis: string[] = [];

		// Extract the table data
		table.find("tr").each((index, element) => {
			if (index === 0) {
				// Skip the header row
				return;
			}
			const row: string[] = [];
			$(element)
				.find("th, td")
				.each((_, cell) => {
					const cellText = $(cell).text().trim();
					row.push(cellText);
				});
			const kanji = row[1];
			if (kanji.length > 1) {
				console.log(kanji);
			}
			kanjis.push(kanji[0]);
		});
		console.log(kanjis);
		console.log(kanjis[829]);
		Bun.write(outputPath, JSON.stringify(kanjis, null, 2));
	} catch (error) {
		console.error("Error fetching or parsing the page:", error);
	}
}

const wikipediaUrl =
	"https://en.wikipedia.org/wiki/List_of_j%C5%8Dy%C5%8D_kanji";
const outputPath = "static/jouyou.json";
scrapeWikipediaTable(wikipediaUrl, outputPath);
