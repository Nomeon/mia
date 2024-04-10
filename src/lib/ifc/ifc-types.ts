export type IfcElement = {
    name: string;
    productcode: string | null;
    station: string | null;
    aantal: string | null;
    categorie: string | null;
    eenheid: string | null;
    breedte: string | null;
    lengte: string | null;
    dikte: string | null;
    gewicht: string | null;
    volume: string | null;
}

export type IfcPropertySingleValue = {
    Name: { value: string };
    NominalValue: { value: string };
    Description: null;
    Unit: null;
    expressID: number;
    type: number;
}