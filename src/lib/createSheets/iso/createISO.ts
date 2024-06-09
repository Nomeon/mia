import Excel from 'exceljs';
import type { IfcElement, Conditions } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

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
          filteredElement.oppervlakte,
          'm2'
      ]);
  });
}