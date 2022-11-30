import {Address} from './class.address';

export default class RFC {

  constructor(private _clave: string,
              private _email: string,
              private _tax_system: string,
              private _address: Address,
              private _tipo: number = RFC.PERSONA_FISICA,
              private _razon_social?: string,
              private _nombres?: string,
              private _apellidos?: string,
              private _telefono?: string,
              private _eliminado: number = 0,
              private _id?: number,
              private _id_usuario?: number) {
  }

  set id(id: number) {
    this._id = Number(id);
  }

  set nombres(nombres: string) {
    this._nombres = nombres;
  }

  set apellidos(apellidos: string) {
    this._apellidos = apellidos;
  }

  set email(email: string) {
    this._email = email;
  }

  set clave(clave: string) {
    this._clave = clave;
  }

  set telefono(telefono: string) {
    this._telefono = telefono;
  }

  set address(address: Address) {
    this._address = address;
  }

  set tipo(tipo: number) {
    this._tipo = Number(tipo);
  }

  set eliminado(eliminado: number) {
    this._eliminado = Number(eliminado);
  }

  set razon_social(razon_social: string) {
    this._razon_social = razon_social;
  }

  set tax_system(tax_system: string) {
    this._tax_system = tax_system;
  }

  set id_usuario(id_usuario: number) {
    this._id_usuario = Number(id_usuario);
  }

  get id(): number {
    return this._id;
  }

  get nombres(): string {
    return this._nombres;
  }

  get apellidos(): string {
    return this._apellidos;
  }

  get email(): string {
    return this._email;
  }

  get clave(): string {
    return this._clave;
  }

  get telefono(): string {
    return this._telefono;
  }

  get address(): Address {
    return this._address;
  }

  get tipo(): number {
    return this._tipo;
  }

  get eliminado(): number {
    return this._eliminado;
  }

  get razon_social(): string {
    return this._razon_social;
  }

  get tax_system(): string {
    return this._tax_system;
  }

  get id_usuario(): number {
    return this._id_usuario;
  }

  get nombreCompleto(): string {
    return this.tipo == RFC.PERSONA_FISICA ? `${this.nombres} ${this.apellidos}` : this.razon_social;
  }

  toJson(): any {
    return {
      nombres: this.nombres,
      apellidos: this.apellidos,
      email: this.email,
      clave: this.clave,
      id: this.id,
      telefono: this.telefono,
      address: this.address,
      tipo: this.tipo,
      eliminado: this.eliminado,
      razon_social: this.razon_social,
      tax_system: this.tax_system,
      id_usuario: this.id_usuario
    };
  }

  fromJson(rfc: any): void {
    //Object.assign(this, rfc);
    this.nombres = rfc.nombres;
    this.apellidos = rfc.apellidos;
    this.tax_system = rfc.tax_system;
    this.email = rfc.email;
    this.clave = rfc.clave;
    this.id = rfc.id;
    this.telefono = rfc.telefono;
    this.address = Address.fromJson(rfc.address || {});
    this.tipo = rfc.tipo;
    this.eliminado = rfc.eliminado;
    this.razon_social = rfc.razon_social;
    this.id_usuario = rfc.id_usuario;
  }

  // Tipo de persona
  static readonly PERSONA_FISICA: number = 1;
  static readonly PERSONA_MORAL: number = 2;
}
