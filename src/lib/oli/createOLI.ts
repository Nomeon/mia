import Excel from 'exceljs';
import type { IfcElement } from "$lib/ifc/ifc-types";
import { conditions } from './conditions';

export function createOLI(wb: Excel.Workbook, elements: IfcElement[]) {
    const OLIelements = elements

    const sheet = wb.addWorksheet('5. Olivijn');
    sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

    // PE folie
    sheet.addRow(['Olivijn']).font = { bold: true };
    conditions.forEach((condition) => {
        OLIelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, 'A1', bn, filteredElement.volume, "m2"])
        })
    });

    return wb;
}