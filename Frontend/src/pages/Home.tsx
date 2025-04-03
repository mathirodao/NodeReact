import React from 'react';
import Login from '../components/Login';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h2 className="mb-0">Iniciar Sesión</h2>
            </div>
            <div className="card-body">
              <Login />
              <p className="mt-3 text-center">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;