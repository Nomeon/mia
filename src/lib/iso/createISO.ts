import Excel from 'exceljs';
import type { IfcElement } from "$lib/ifc/ifc-types";
import { conditions } from './conditions';

export function createISO(wb: Excel.Workbook, elements: IfcElement[]) {
    const ISOelements = elements

    const sheet = wb.addWorksheet('3. Isolatie');
    sheet.addRow([' ', 'Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

    // Glaswol isolatie
    sheet.addRow(['Glaswol isolatie']).font = { bold: true };
    conditions.forEach((condition) => {
        ISOelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.name === condition.filter &&
            condition.type === 'Glaswol'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.name, 'A1', bn, filteredElement.volume, "m2"])
        })
    });

    // Steenwol isolatie
    sheet.addRow(['Steenwol isolatie']).font = { bold: true };
    conditions.forEach((condition) => {
        ISOelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.name === condition.filter &&
            condition.type === 'Steenwol'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.name, 'A1', bn, filteredElement.volume, "m2"])
        })
    });

    // Los te leveren steenwol isolatie
    sheet.addRow(['Lose te leveren steenwol isolatie']).font = { bold: true };
    conditions.forEach((condition) => {
        ISOelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.name === condition.filter &&
            condition.type === 'Los te leveren'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.name, 'A1', bn, filteredElement.volume, "m2"])
        })
    });

    return wb;
}