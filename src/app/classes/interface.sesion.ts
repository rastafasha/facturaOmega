import Usuario from './class.usuario';
import RFC from './class.rfc';

export default interface ISesion {
    usuario: Usuario;
    token: string;
    rfc?: RFC;
    perfil?: number;
    path?: string;
}
