// address.interface.ts
export interface ILocalAddress {
  name: string; // Local address name (e.g., street or neighborhood)
  details: string; // Optional additional details about the address
}

export interface ISubdistrict {
  name: string; // Subdistrict name (e.g., area or locality)
  localAddresses: ILocalAddress[]; // List of local addresses in the subdistrict
}

export interface IDistrict {
  name: string; // District name (e.g., Dhaka)
  subdistricts: ISubdistrict[]; // List of subdistricts in the district
}

export interface IDivision {
  name: string; // Division name (e.g., Dhaka)
  districts: IDistrict[]; // List of districts in the division
}

export interface IAddress {
  country: string; // Bangladesh (optional, but could be useful for multiple countries)
  divisions: IDivision[]; // List of divisions with districts and subdistricts
}
