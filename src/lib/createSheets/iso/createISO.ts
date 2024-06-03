import Excel from 'exceljs';
import type { IfcElement } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';

export function createISO(wb: Excel.Workbook, elements: IfcElement[]) {
	// Aggregate elements by station, code, materiaal, dikte and add up the volume
	const aggregation = elements.reduce((acc, element) => {
		const key = `${element.station}-${element.code}-${element.materiaal}-${element.dikte}-${element.bnr}-${element.bouwdeel}`;
		if (!acc.has(key)) {
			acc.set(key, { ...element, volume: element.volume }); // Assuming 'volume' exists and is a number
		} else {
			acc.get(key).volume += element.volume;
			acc.get(key).aantal += element.aantal;
		}
		return acc;
	}, new Map());

	const ISOelements = Array.from(aggregation.values());

	const sheet = wb.addWorksheet('3. Isolatie');
	sheet.addRow([' ', 'Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

	// Glaswol isolatie
	sheet.addRow(['Glaswol isolatie']).font = { bold: true };
	conditions.forEach((condition) => {
		ISOelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.name === condition.filter &&
				condition.type === 'Glaswol'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.name,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// Steenwol isolatie
	sheet.addRow(['Steenwol isolatie']).font = { bold: true };
	conditions.forEach((condition) => {
		ISOelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.name === condition.filter &&
				condition.type === 'Steenwol'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.name,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// Los te leveren steenwol isolatie
	sheet.addRow(['Lose te leveren steenwol isolatie']).font = { bold: true };
	conditions.forEach((condition) => {
		ISOelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.name === condition.filter &&
				condition.type === 'Los te leveren'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.name,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	return wb;
}
