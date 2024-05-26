import Excel from 'exceljs';
import type { IfcElement } from "$lib/ifc/ifc-types";
import { conditions } from './conditions';

export function createLVL(wb: Excel.Workbook, elements: IfcElement[]) {
    // Filter elements such that materiaal = LVLQ, LVLS, and BAUB
    // let LVLelements = elements.filter(element =>
    //     element.materiaal === 'LVLQ' ||
    //     element.materiaal === 'LVLS' ||
    //     element.materiaal === 'BAUB'
    // );

    // // Aggregate elements by station, code, materiaal, dikte and add up the gewicht
    // const aggregation = LVLelements.reduce((acc, element) => {
    //     const key = `${element.station}-${element.code}-${element.materiaal}-${element.dikte}`;
    //     if (!acc.has(key)) {
    //         acc.set(key, {...element, gewicht: element.gewicht}); // Assuming 'gewicht' exists and is a number
    //     } else {
    //         acc.get(key).gewicht += element.gewicht;
    //     }
    //     return acc;
    // }, new Map());

    // LVLelements = Array.from(aggregation.values());

    const LVLelements = elements

    const sheet = wb.addWorksheet('1. LVL');
    sheet.addRow(['Name', 'Dikte', 'Bouwdeel', 'BN', 'Inhoud', 'Eenheid']);

    // LVL VLoer
    sheet.addRow(['LVL vloer']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLvloer'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    // LVL Plafond
    sheet.addRow(['LVL plafond']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLplafond'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    // LVL Gevel
    sheet.addRow(['LVL gevel']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLgevel'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    // LVL Woningscheidende wand
    sheet.addRow(['LVL woningscheidende wand']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLwsw' &&
            element.name.includes('WSW')
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    // LVL Binnenwand
    sheet.addRow(['LVL binnenwand']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLbw' &&
            !element.name.includes('WSW')
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    // Kolommen
    sheet.addRow(['Kolommen']).font = { bold: true };
    conditions.forEach((condition) => {
        LVLelements.filter(element =>
            element.station === condition.station &&
            element.code === condition.code &&
            element.materiaal === condition.materiaal &&
            element.dikte === condition.dikte &&
            condition.type === 'LVLkolom'
        ).forEach((filteredElement) => {
            const bn = filteredElement.modulenaam!.split('-')[1];
            sheet.addRow([filteredElement.materiaal, filteredElement.dikte, 'A1', bn, filteredElement.gewicht, "kg"])
        })
    });

    return wb;
}