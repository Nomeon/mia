import Excel from 'exceljs';
import type { IfcElement } from '$lib/ifc/ifc-types';
import { conditions } from './conditions';
import { aggregate } from '$lib/ifc/aggregate';

export function createLVL(wb: Excel.Workbook, elements: IfcElement[]) {
	const sheet = wb.addWorksheet('1. LVL');
	sheet.addRow(['Name', 'Dikte', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

	// LVL VLoer
	sheet.addRow(['LVL vloer']).font = { bold: true };
  const LVLvloerElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLvloer') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte
        ) {
          LVLvloerElements.push(element);
        }
      }
    }
  }
  aggregate(LVLvloerElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });

	// LVL Plafond
	sheet.addRow(['LVL plafond']).font = { bold: true };
  const LVLplafondElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLplafond') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte
        ) {
          LVLplafondElements.push(element);
        }
      }
    }
  }
  aggregate(LVLplafondElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });  

	// LVL Gevel
	sheet.addRow(['LVL gevel']).font = { bold: true };
	const LVLgevelElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLgevel') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte
        ) {
          LVLgevelElements.push(element);
        }
      }
    }
  }
  aggregate(LVLgevelElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });

	// LVL Woningscheidende wand
	sheet.addRow(['LVL woningscheidende wand']).font = { bold: true };
	const LVLwswElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLwsw') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte &&
          element.name.includes('WSW')
        ) {
          LVLwswElements.push(element);
        }
      }
    }
  }

  aggregate(LVLwswElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });

	// LVL Binnenwand
	sheet.addRow(['LVL binnenwand']).font = { bold: true };
	const LVLbwElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLbw') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte &&
          !element.name.includes('WSW')
        ) {
          LVLbwElements.push(element);
        }
      }
    }
  }

  aggregate(LVLbwElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });

	// Kolommen
	sheet.addRow(['Kolommen']).font = { bold: true };
	const LVLkolomElements = [];
  for (const condition of conditions) {
    if (condition.type === 'LVLkolom') {
      for (const element of elements) {
        if (
          element.station === condition.station &&
          element.code === condition.code &&
          element.materiaal === condition.materiaal &&
          element.dikte === condition.dikte
        ) {
          LVLkolomElements.push(element);
        }
      }
    }
  }

  aggregate(LVLkolomElements).forEach((filteredElement) => {
    sheet.addRow([
      filteredElement.materiaal,
      filteredElement.dikte,
      filteredElement.bouwdeel,
      filteredElement.bnr,
      filteredElement.gewicht,
      'kg'
    ]);
  });
  
	return wb;
}
