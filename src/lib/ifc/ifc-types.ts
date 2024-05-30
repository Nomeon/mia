export type IfcElement = {
	name: string;
	productcode: string;
	modulenaam: string;
	station: string;
	aantal: string;
	materiaal: string;
	gewicht: string;
	dikte: number | string | null;
	volume: string;
	code: string;
	bnr: string | null | undefined;
	bouwdeel: string | null | undefined;
};

export type IfcPropertySingleValue = {
	Name: { value: string };
	NominalValue: { value: string };
	Description: null;
	Unit: null;
	expressID: number;
	type: number;
};
