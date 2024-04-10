import { type IfcElement } from './ifc-types';
import { writeFileXLSX } from 'xlsx'
import * as XLSX from 'xlsx';

export function ifcToExcel(elements: IfcElement[]) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(elements);
    XLSX.utils.book_append_sheet(wb, ws, "IFC Elements");
    writeFileXLSX(wb, "IFC_Elements.xlsx");
}