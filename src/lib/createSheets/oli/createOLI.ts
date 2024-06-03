import Excel from 'exceljs';
import type { IfcElement } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';

export function createOLI(wb: Excel.Workbook, elements: IfcElement[]) {
	// Aggregate elements by station, code, materiaal, dikte and add up the volume
	const aggregation = elements.reduce((acc, element) => {
		const key = `${element.station}-${element.code}-${element.materiaal}-${element.dikte}-${element.bnr}-${element.bouwdeel}`;
		if (!acc.has(key)) {
			acc.set(key, { ...element, volume: element.volume, gewicht: element.gewicht }); // Assuming 'volume' exists and is a number
		} else {
			acc.get(key).volume += element.volume;
			acc.get(key).gewicht += element.gewicht;
			acc.get(key).aantal += element.aantal;
		}
		return acc;
	}, new Map());

	const OLIelements = Array.from(aggregation.values());

	const sheet = wb.addWorksheet('5. Olivijn');
	sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid', 'Gewicht', 'Eenheid']);

	// PE folie
	sheet.addRow(['Olivijn']).font = { bold: true };
	conditions.forEach((condition) => {
		OLIelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2',
				filteredElement.gewicht,
				'kg'
			]);
		});
	});

	return wb;
}
