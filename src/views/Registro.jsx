import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PanelAcceso from '../components/PanelAcceso.jsx';
import { api } from '../api.js';
import { guardarSesion } from '../sesion.js';

const INICIAL = {
  dni: '', nombres: '', apellidos: '', telefono: '', correo: '',
  password: '', sexo: 'MASCULINO', seguro: 'SIS',
};

export default function Registro() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(INICIAL);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  async function registrar(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{8}$/.test(datos.dni)) {
      setError('El DNI debe tener 8 dígitos.');
      return;
    }
    if (datos.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    try {
      const p = await api('/auth/paciente/registro', { method: 'POST', body: datos });
      guardarSesion('paciente', p);
      navigate('/inicio');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <PanelAcceso>
      <h2>Crear cuenta</h2>
      <p className="subtitulo">Regístrate para reservar tus citas en línea</p>

      <form onSubmit={registrar} className="formulario">
        <div className="fila-2">
          <label className="campo">
            <span>DNI</span>
            <input value={datos.dni} onChange={cambiar('dni')} maxLength={8} inputMode="numeric" required />
          </label>
          <label className="campo">
            <span>Teléfono</span>
            <input value={datos.telefono} onChange={cambiar('telefono')} maxLength={15} inputMode="tel" />
          </label>
        </div>
        <div className="fila-2">
          <label className="campo">
            <span>Nombres</span>
            <input value={datos.nombres} onChange={cambiar('nombres')} required />
          </label>
          <label className="campo">
            <span>Apellidos</span>
            <input value={datos.apellidos} onChange={cambiar('apellidos')} required />
          </label>
        </div>
        <label className="campo">
          <span>Correo electrónico</span>
          <input type="email" value={datos.correo} onChange={cambiar('correo')} placeholder="ejemplo@correo.com" required />
        </label>
        <label className="campo">
          <span>Contraseña</span>
          <input type="password" value={datos.password} onChange={cambiar('password')} placeholder="Mínimo 6 caracteres" required />
        </label>
        <div className="fila-2">
          <label className="campo">
            <span>Sexo</span>
            <select value={datos.sexo} onChange={cambiar('sexo')}>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
            </select>
          </label>
          <label className="campo">
            <span>Seguro</span>
            <select value={datos.seguro} onChange={cambiar('seguro')}>
              <option>SIS</option>
              <option>EsSalud</option>
              <option>Particular</option>
              <option>Ninguno</option>
            </select>
          </label>
        </div>

        {error && <p className="alerta">{error}</p>}

        <button className="boton boton-bloque" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="pie-form">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </PanelAcceso>
  );
}
