export type PropertyMappings = {
	Productcode: string;
	Modulenaam: string;
	Station: string;
	Aantal: string;
	Materiaal: string;
	Dikte: string;
	Gewicht: string;
	Volume: string;
	'Naa.K.T': string;
};

export type IfcElement = {
	name: string;
	productcode: string;
	modulenaam: string;
	station: string;
	aantal: number;
	materiaal: string;
  lengte: number;
  breedte: number;
	dikte: number;
	gewicht: number;
	volume: number;
	code: string;
  oppervlakte: number;
	bnr?: number;
	bouwdeel?: string;
};

export type IfcType = {
	typeID: number;
	typeName: string;
};

export type Conditions = {
  station: string;
  code: string;
  materiaal?: string;
  dikte?: number;
  type?: string;
  name: string;
	filter?: string;
}[];