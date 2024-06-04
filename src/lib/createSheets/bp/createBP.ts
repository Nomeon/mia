import Excel from 'exceljs';
import type { IfcElement } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';

export function createBP(wb: Excel.Workbook, elements: IfcElement[]) {
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

	const BPelements = Array.from(aggregation.values());

	// const BPelements = elements;

	const sheet = wb.addWorksheet('2. Beplating');
	sheet.addRow(['Name', 'Dikte', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

	// CEM Panel
	sheet.addRow(['CEM Panel']).font = { bold: true };
	conditions.forEach((condition) => {
		BPelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal &&
				element.dikte === condition.dikte &&
				condition.type === 'CEMpanel'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.dikte,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// Windstopper
	sheet.addRow(['Windstopper gevel']).font = { bold: true };
	conditions.forEach((condition) => {
		BPelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal &&
				element.dikte === condition.dikte &&
				condition.type === 'Windstopper'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.dikte,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// Spaanplaat
	sheet.addRow(['Spaanplaat']).font = { bold: true };
	conditions.forEach((condition) => {
		BPelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal &&
				element.dikte === condition.dikte &&
				condition.type === 'Spaanplaat'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.dikte,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// MDF
	sheet.addRow(['MDF']).font = { bold: true };
	conditions.forEach((condition) => {
		BPelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal &&
				element.dikte === condition.dikte &&
				condition.type === 'MDF'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.dikte,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	// Promatect 100
	sheet.addRow(['Promatect 100']).font = { bold: true };
	conditions.forEach((condition) => {
		BPelements.filter(
			(element) =>
				element.station === condition.station &&
				element.code === condition.code &&
				element.materiaal === condition.materiaal &&
				element.dikte === condition.dikte &&
				condition.type === 'Promatect 100'
		).forEach((filteredElement) => {
			sheet.addRow([
				condition.name,
				filteredElement.dikte,
				filteredElement.bouwdeel,
				filteredElement.bnr,
				filteredElement.volume,
				'm2'
			]);
		});
	});

	return wb;
}
