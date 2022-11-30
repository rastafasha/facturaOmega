export class Address {
  zip: string;
  street?: string;
  exterior?: string;
  interior?: string;
  neighborhood?: string;
  city?: string;
  municipality?: string;
  state?: string;
  country?: string;

  static fromJson(data: any = {}): Address {
    const address = new Address();
    address.zip = data.zip;
    address.street = data.street;
    address.exterior = data.exterior;
    address.interior = data.interior;
    address.neighborhood = data.neighborhood;
    address.city = data.city;
    address.municipality = data.municipality;
    address.state = data.state;
    address.country = data.country;
    return address;
  }
}
