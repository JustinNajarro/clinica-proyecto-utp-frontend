import { obtenerSesion } from '../sesion.js';
import { iniciales } from '../formato.js';

export default function Perfil() {
  const { datos: p } = obtenerSesion();
  const sexo = p.sexo ? p.sexo.charAt(0) + p.sexo.slice(1).toLowerCase() : '-';

  return (
    <>
      <div className="titulo-pagina">
        <h1>Mi perfil</h1>
        <p>Estos son los datos con los que te registraste.</p>
      </div>

      <section className="tarjeta perfil">
        <span className="avatar avatar-perfil">{iniciales(p.nombres, p.apellidos)}</span>
        <div>
          <h3>Información personal</h3>
          <dl className="perfil-datos">
            <div><dt>Nombre completo</dt><dd>{p.nombres} {p.apellidos}</dd></div>
            <div><dt>DNI</dt><dd>{p.dni}</dd></div>
            <div><dt>Correo electrónico</dt><dd>{p.correo || '-'}</dd></div>
            <div><dt>Teléfono</dt><dd>{p.telefono || '-'}</dd></div>
            <div><dt>Sexo</dt><dd>{sexo}</dd></div>
            <div><dt>Seguro</dt><dd>{p.seguro || '-'}</dd></div>
          </dl>
        </div>
      </section>
    </>
  );
}
