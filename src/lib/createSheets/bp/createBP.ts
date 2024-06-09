import Excel from 'exceljs';
import type { IfcElement, Conditions } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

export function createBP(wb: Excel.Workbook, elements: IfcElement[]) {
	const sheet = wb.addWorksheet('2. Beplating');
	sheet.addRow(['Name', 'Dikte', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);
  sheet.addRow(['CEMpanel']).font = { bold: true };
  processElements(conditions, elements, 'CEMpanel', 'CEM Vloer onderplaat', sheet);
  processElements(conditions, elements, 'CEMpanel', 'CEM gevel', sheet);
  sheet.addRow(['Windstopper']).font = { bold: true };
  processElements(conditions, elements, 'Windstopper', 'Windstopper', sheet);
  sheet.addRow(['Spaanplaat']).font = { bold: true };
  processElements(conditions, elements, 'Spaanplaat', 'SPANO plafond en dak', sheet);
  processElements(conditions, elements, 'Spaanplaat', 'SPANO dak', sheet);
  processElements(conditions, elements, 'Spaanplaat', 'SPANO gevels', sheet);
  processElements(conditions, elements, 'Spaanplaat', 'SPANO binnenwand', sheet);
  sheet.addRow(['MDF']).font = { bold: true };
  processElements(conditions, elements, 'MDF', 'MDF plafond', sheet);
  processElements(conditions, elements, 'MDF', 'Binnenwand Clicwall', sheet);
  sheet.addRow(['Promatect 100']).font = { bold: true };
  processElements(conditions, elements, 'Promatect 100', 'Promatect onderzijde vloeren', sheet);
  processElements(conditions, elements, 'Promatect 100', 'Promatect vloercassette', sheet);
	return wb;
}

// Function to process elements based on specific conditions
function processElements(conditions: Conditions, elements: IfcElement[], type: string, name: string, sheet: Excel.Worksheet) {
  const filteredConditions = conditions.filter(c => c.type === type && c.name === name);
  const matchedElements = elements.filter(element =>
      filteredConditions.some(condition =>
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte
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
          'm2',
      ]);
  });
}