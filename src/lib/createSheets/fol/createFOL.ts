import Excel from 'exceljs';
import type { IfcElement } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';

export function createFOL(wb: Excel.Workbook, elements: IfcElement[]) {
	// Aggregate elements by station, code, materiaal, dikte and add up the volume
	const aggregation = elements.reduce((acc, element) => {
		const key = `${element.station}-${element.code}-${element.materiaal}-${element.dikte}`;
		if (!acc.has(key)) {
			acc.set(key, { ...element, volume: element.volume }); // Assuming 'volume' exists and is a number
		} else {
			acc.get(key).volume += element.volume;
			acc.get(key).aantal += element.aantal;
		}
		return acc;
	}, new Map());

	const FOLelements = Array.from(aggregation.values());

	const sheet = wb.addWorksheet('4. Folies');
	sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

	// PE folie
	sheet.addRow(['PE folie']).font = { bold: true };
	conditions.forEach((condition) => {
		FOLelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.name.includes(condition.filter)
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	return wb;
}
