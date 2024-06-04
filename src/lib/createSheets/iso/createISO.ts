import Excel from 'exceljs';
import type { IfcElement, Conditions } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

// export function createISO(wb: Excel.Workbook, elements: IfcElement[]) {
// 	// Aggregate elements by station, code, materiaal, dikte and add up the volume
// 	const aggregation = elements.reduce((acc, element) => {
// 		const key = `${element.station}-${element.code}-${element.materiaal}-${element.dikte}-${element.bnr}-${element.bouwdeel}`;
// 		if (!acc.has(key)) {
// 			acc.set(key, { ...element, volume: element.volume }); // Assuming 'volume' exists and is a number
// 		} else {
// 			acc.get(key).volume += element.volume;
// 			acc.get(key).aantal += element.aantal;
// 		}
// 		return acc;
// 	}, new Map());

// 	const ISOelements = Array.from(aggregation.values());

// 	const sheet = wb.addWorksheet('3. Isolatie');
// 	sheet.addRow([' ', 'Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

// 	// Glaswol isolatie
// 	sheet.addRow(['Glaswol isolatie']).font = { bold: true };
// 	conditions.forEach((condition) => {
// 		ISOelements.filter(
// 			(element) =>
// 				element.station === condition.station &&
// 				element.code === condition.code &&
// 				element.name === condition.filter &&
// 				condition.type === 'Glaswol'
// 		).forEach((filteredElement) => {
// 			sheet.addRow([
// 				condition.name,
// 				filteredElement.name,
// 				filteredElement.bouwdeel,
// 				filteredElement.bnr,
// 				filteredElement.volume,
// 				'm2'
// 			]);
// 		});
// 	});

// 	// Steenwol isolatie
// 	sheet.addRow(['Steenwol isolatie']).font = { bold: true };
// 	conditions.forEach((condition) => {
// 		ISOelements.filter(
// 			(element) =>
// 				element.station === condition.station &&
// 				element.code === condition.code &&
// 				element.name === condition.filter &&
// 				condition.type === 'Steenwol'
// 		).forEach((filteredElement) => {
// 			sheet.addRow([
// 				condition.name,
// 				filteredElement.name,
// 				filteredElement.bouwdeel,
// 				filteredElement.bnr,
// 				filteredElement.volume,
// 				'm2'
// 			]);
// 		});
// 	});

// 	// Los te leveren steenwol isolatie
// 	sheet.addRow(['Lose te leveren steenwol isolatie']).font = { bold: true };
// 	conditions.forEach((condition) => {
// 		ISOelements.filter(
// 			(element) =>
// 				element.station === condition.station &&
// 				element.code === condition.code &&
// 				element.name === condition.filter &&
// 				condition.type === 'Los te leveren'
// 		).forEach((filteredElement) => {
// 			sheet.addRow([
// 				condition.name,
// 				filteredElement.name,
// 				filteredElement.bouwdeel,
// 				filteredElement.bnr,
// 				filteredElement.volume,
// 				'm2'
// 			]);
// 		});
// 	});

// 	return wb;
// }

export function createISO(wb: Excel.Workbook, elements: IfcElement[]) {
  const sheet = wb.addWorksheet('3. Isolatie');
  sheet.addRow([' ', 'Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

  sheet.addRow(['Glaswol isolatie']).font = { bold: true };
  processElements(conditions, elements, 'Glaswol', 'Isolatie vloeren', sheet);
  processElements(conditions, elements, 'Glaswol', 'Isolatie binnenwanden', sheet);

  sheet.addRow(['Steenwol isolatie']).font = { bold: true };
  processElements(conditions, elements, 'Steenwol', 'Isolatie vloeren', sheet);
  processElements(conditions, elements, 'Steenwol', 'Isolatie gevels en WSW', sheet);

  sheet.addRow(['Los te leveren steenwol isolatie']).font = { bold: true };
  processElements(conditions, elements, 'Los te leveren', 'Isolatie brandscheiding', sheet);
  processElements(conditions, elements, 'Los te leveren', 'Isolatie gevels', sheet);

  return wb;
}

// Function to process elements based on specific conditions
function processElements(conditions: Conditions, elements: IfcElement[], type: string, name: string, sheet: Excel.Worksheet) {
  const filteredConditions = conditions.filter(c => c.type === type && c.name === name);
  const matchedElements = elements.filter(element =>
      filteredConditions.some(condition =>
          element.station === condition.station &&
          element.code === condition.code
      )
  );

  const aggregatedElements = aggregate(matchedElements);
  aggregatedElements.forEach(filteredElement => {
      sheet.addRow([
          name,
          filteredElement.dikte,
          filteredElement.bouwdeel,
          filteredElement.bnr,
          filteredElement.volume,
          'm2'
      ]);
  });
}