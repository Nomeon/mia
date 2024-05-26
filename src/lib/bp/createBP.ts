import Excel from 'exceljs';
import type { IfcElement } from "$lib/ifc/ifc-types";
import { conditions } from './conditions';

export function createBP(wb: Excel.Workbook, elements: IfcElement[]) {
    const BPelements = elements

    const sheet = wb.addWorksheet('2. Beplating');
    sheet.addRow(['Name', 'Dikte', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

    // CEM Panel
    sheet.addRow(['CEM Panel']).font = { bold: true };
    conditions.forEach((condition) => {
        BPelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'CEMpanel'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "m2"])
        })
    });

    // Windstopper
    sheet.addRow(['Windstopper gevel']).font = { bold: true };
    conditions.forEach((condition) => {
        BPelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'Windstopper'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "m2"])
        })
    });

    // Spaanplaat
    sheet.addRow(['Spaanplaat']).font = { bold: true };
    conditions.forEach((condition) => {
        BPelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'Spaanplaat'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "m2"])
        })
    });

    // MDF
    sheet.addRow(['MDF']).font = { bold: true };
    conditions.forEach((condition) => {
        BPelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'MDF'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "m2"])
        })
    });

    // Promatect 100
    sheet.addRow(['Promatect 100']).font = { bold: true };
    conditions.forEach((condition) => {
        BPelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'Promatect100'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([condition.name, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "m2"])
        })
    });

    return wb;
}