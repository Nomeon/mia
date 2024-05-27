export type IfcElement = {
    name: string;
    productcode: string | null;
    modulenaam: string | null;
    station: string | null;
    aantal: string;
    materiaal: string | null;
    gewicht: number | string | null;
    dikte: number | string | null;
    volume: string | null;
    code: string | null;
}

export type IfcPropertySingleValue = {
    Name: { value: string };
    NominalValue: { value: string };
    Description: null;
    Unit: null;
    expressID: number;
    type: number;
}