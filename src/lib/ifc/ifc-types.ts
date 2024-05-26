export type IfcElement = {
    name: string;
    productcode: string | null;
    modulenaam: string | null;
    station: string | null;
    aantal: string;
    categorie: string | null;
    materiaal: string | null;
    eenheid: string | null;
    breedte: string | null;
    lengte: string | null;
    dikte: string | number | null;
    gewicht: string | null;
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