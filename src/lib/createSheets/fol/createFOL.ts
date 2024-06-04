import Excel from 'exceljs';
import type { IfcElement, Conditions } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

export function createFOL(wb: Excel.Workbook, elements: IfcElement[]) {
	const sheet = wb.addWorksheet('4. Folies');
	sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

	sheet.addRow(['PE folie']).font = { bold: true };
	processElements(conditions, elements, 'Folie plafond', sheet);
	processElements(conditions, elements, 'Folie WSW', sheet);
	processElements(conditions, elements, 'Folie gevel', sheet);

	return wb;
}

// Function to process elements based on specific conditions
function processElements(conditions: Conditions, elements: IfcElement[], name: string, sheet: Excel.Worksheet) {
  const filteredConditions = conditions.filter(c => c.name === name);
  const matchedElements = elements.filter(element =>
      filteredConditions.some(condition =>
          element.station === condition.station &&
          element.code === condition.code &&
					element.materiaal === condition.materiaal &&
					element.name.includes(condition.filter!)
      )
  );

  const aggregatedElements = aggregate(matchedElements);
  aggregatedElements.forEach(filteredElement => {
      sheet.addRow([
          name,
          filteredElement.bouwdeel,
          filteredElement.bnr,
          filteredElement.volume,
          'm2'
      ]);
  });
}
