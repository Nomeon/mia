import Excel from 'exceljs';
import type { IfcElement } from "$lib/ifc/ifc-types";
import { conditions } from './conditions';

export function createFOL(wb: Excel.Workbook, elements: IfcElement[]) {
    const FOLelements = elements

    const sheet = wb.addWorksheet('4. Folies');
    sheet.addRow(['Name', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

    // PE folie
    sheet.addRow(['PE folie']).font = { bold: true };
    conditions.forEach((condition) => {
        FOLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.name.includes(condition.filter)
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, 'A1', bn, filteredElement.volume, "m2"])
        })
    });

    return wb;
}