
export default class Usuario {

    constructor(private _nombres: string,
                private _apellidos: string,
                private _email: string,
                private _password: string,
                private _tipo_auth: number = Usuario.NORMAL,
                private _alta: number = Usuario.ALTA,
                private _telefono?: string,
                private _fecha_bloqueo?: Date,
                private _perfiles: number[] = [],
                private _id?: number) {}

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

    set password(password: string) {
        this._password = password;
    }

    set telefono(telefono: string) {
        this._telefono = telefono;
    }

    set tipo_auth(tipo_auth: number) {
        this._tipo_auth = Number(tipo_auth);
    }

    set alta(alta: number) {
        this._alta = Number(alta);
    }

    set fecha_bloqueo(fecha_bloqueo: Date) {
        if (fecha_bloqueo) {
            this._fecha_bloqueo = new Date(fecha_bloqueo);
        } else {
            this._fecha_bloqueo = null;
        }
    }

    set perfiles(perfiles: number[]) {
        this._perfiles = perfiles;
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

    get password(): string {
        return this._password;
    }

    get telefono(): string {
        return this._telefono;
    }

    get tipo_auth(): number {
        return this._tipo_auth;
    }

    get alta(): number {
        return this._alta;
    }

    get fecha_bloqueo(): Date {
        return this._fecha_bloqueo;
    }

    get perfiles(): number[] {
        return this._perfiles;
    }

    get nombreCompleto(): string {
        return `${this.nombres} ${this.apellidos}`;
    }

    toJson(): any {
        return {
            nombres          : this.nombres,
            apellidos        : this.apellidos,
            email            : this.email,
            password         : this.password,
            id               : this.id,
            telefono         : this.telefono,
            tipo_auth        : this.tipo_auth,
            alta             : this.alta,
            fecha_bloqueo    : this.fecha_bloqueo,
            perfiles         : this.perfiles
        };
    }

    fromJson(usuario: any): Usuario {
        Object.assign(this, usuario);

        return this;/* 


        this.nombres = usuario.nombres;
        this.apellidos = usuario.apellidos;
        this.email = usuario.email;
        this.password = usuario.password;
        this.tipo_auth = usuario.tipo_auth;
        this.alta = usuario.alta;
        this.telefono = usuario.telefono;
        this.fecha_bloqueo = usuario.fecha_bloqueo;

        let perfiles: number [] = [];
        
        if (usuario.perfiles) {
            usuario.perfiles
                .forEach(perfil => perfiles.push(Number(perfil)));
        }
        this.perfiles = perfiles;

        this.id = usuario.id; */
    }

    // Status
    static readonly ALTA: number = 1;
    static readonly BAJA: number = 0;
    // Tipo de autenticacion
    static readonly NORMAL: number = 1;
    static readonly GOOGLE: number = 2;
    static readonly FACEBOOK: number = 3;
    // Roles de usuario
    static readonly ADMINISTRADOR: number = 3;
    static readonly CAPTURISTA: number = 2;
    static readonly CLIENTE: number = 1;
}