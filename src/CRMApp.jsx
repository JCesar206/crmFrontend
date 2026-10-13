import React, { useState, useEffect } from "react";

const CRMApp = () => {
  const [clientes, setClientes] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para formulario de cliente nuevo
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');

  const API_URL = 'http://127.0.0.1:8000';
  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Peticiones paralelas al backend en Python
      const [resClientes, resCotizaciones] = await Promise.all([
        fetch(`${API_URL}/clientes`),
        fetch(`${API_URL}/cotizaciones`)
      ]);
      if (!resClientes.ok || !resCotizaciones.ok) {
        throw new Error('Error al conectar con el backend de Python.');
      }
      const dataClientes = await resClientes.json();
      const dataCotizaciones = await resCotizaciones.json();

      setClientes(dataClientes);
      setCotizaciones(dataCotizaciones);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un cliente en Python via POST
  const handleCreateCliente = async (e) => {
    e.preventDefault();
    if (!nombre || !email) return;

    try {
      const response = await fetch(`${API_URL}/clientes` ,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre, email, empresa })
      });

      if (response.ok) {
        setNombre('');
        setEmail('');
        setEmpresa('');
        fetchData(); // Recargar datos
      }
    } catch (err) {
      console.error('Error creando cliente:', err);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando datos desde Python...</div>;
  if (error) return <div className="p-6 text-center text-gray-500">Error: {error}. ¿Está encendido uvicorn?</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mini CRM (React + Python)</h1>
            <p className="text-sm text-gray-500">Conectado exitosamente a FastAPI y MySQL</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            API Online
          </span>
        </header>
        <div className="grid grild-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario Cliente Nuevo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar Cliente</h2>
            <form onSubmit={handleCreateCliente} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ej. María Pérez" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="maria@empresa.com" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Empresa</label>
                <input type="text" value={empresa} onChange={(e)=>setEmpresa(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nombre de la empresa" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition cursor-pointer">Guardar Cliente</button>
            </form>
          </div>

          {/* Listado de Clientes y Cotizaciones */}
          <div className="md:col-span-2 space-y-6">
            {/* Tabla Clientes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Clientes Registrados ({clientes.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="py-2 px-3">Nombre</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Empresa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c=>(
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-900">{c.nombre}</td>
                        <td className="py-2 px-3">{c.email}</td>
                        <td className="py-2 px-3">{c.empresa || 'NA'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Cotizaciones */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Cotizaciones Activas ({cotizaciones.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="py-2 px-3">Título</th>
                      <th className="py-2 px-3">Cliente ID</th>
                      <th className="py-2 px-3">Total</th>
                      <th className="py-2 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizaciones.map(cot => (
                      <tr key={cot.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-900">{cot.titulo}</td>
                        <td className="py-2 px-3">#{cot.cliente_id}</td>
                        <td className="py-2 px-3">${cot.total.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            cot.estado === 'Aceptada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cot.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CRMApp;