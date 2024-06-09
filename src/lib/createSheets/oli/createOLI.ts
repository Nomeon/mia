import Excel from 'exceljs';
import type { IfcElement, Conditions } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

export function createOLI(wb: Excel.Workbook, elements: IfcElement[]) {
	const sheet = wb.addWorksheet('5. Olivijn');
	sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid', 'Gewicht', 'Eenheid']);
	sheet.addRow(['Olivijn']).font = { bold: true };
	processElements(conditions, elements, 'Olivijn 8/16mm', sheet);

	return wb;
}

// Function to process elements based on specific conditions
function processElements(conditions: Conditions, elements: IfcElement[], name: string, sheet: Excel.Worksheet) {
  const filteredConditions = conditions.filter(c => c.name === name);
  const matchedElements = elements.filter(element =>
      filteredConditions.some(condition =>
          element.station === condition.station &&
          element.code === condition.code &&
					element.materiaal === condition.materiaal
      )
  );

  const aggregatedElements = aggregate(matchedElements);
  aggregatedElements.forEach(filteredElement => {
      sheet.addRow([
          name,
          filteredElement.bouwdeel,
          filteredElement.bnr,
          filteredElement.volume,
          'm3',
					filteredElement.gewicht,
					'kg'
      ]);
  });
}