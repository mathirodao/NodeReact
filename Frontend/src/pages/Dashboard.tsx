import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersStats, getFailedLoginStats } from '../services/userService';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  adminsCount: number;
}

interface LoginStats {
  totalFailedAttempts: number;
  failedAttemptsByUser: Array<{
    username: string;
    attempts: number;
  }>;
}

interface DashboardProps {
  user: {
    _id: string;
    role: string;
  };
}

interface UserDetail {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    lastLogin: Date | null;
    failedAttempts: number;
  }

const defaultUserStats: UserStats = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  blockedUsers: 0,
  adminsCount: 0
};

const defaultLoginStats: LoginStats = {
  totalFailedAttempts: 0,
  failedAttemptsByUser: []
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [loginStats, setLoginStats] = useState<LoginStats>(defaultLoginStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
  
    if (user.role !== 'admin') {
      navigate('/welcome');
      return;
    }
  
    const fetchData = async () => {
      try {
        const [statsResponse, loginResponse] = await Promise.all([
          getUsersStats().catch((err) => {
            console.error('Error en getUsersStats:', err);
            return defaultUserStats;
          }),
          getFailedLoginStats().catch((err) => {
            console.error('Error en getFailedLoginStats:', err);
            return defaultLoginStats;
          })
        ]);
        
        setUserStats(statsResponse || defaultUserStats);
        setLoginStats(loginResponse || defaultLoginStats);
      } catch (err) {
        console.error('Error general obteniendo estadísticas:', err);
        setError('Error al cargar las estadísticas. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    
    <div className="container mt-4">
      <h1 className="mb-4">Panel de Administración</h1>
      
      <div className="row mb-4">
        <h2 className="mb-3">Estadísticas de Usuarios</h2>
        
        {[
          { title: 'Total Usuarios', value: userStats.totalUsers, bg: 'primary' },
          { title: 'Usuarios Activos', value: userStats.activeUsers, bg: 'success' },
          { title: 'Usuarios Inactivos', value: userStats.inactiveUsers, bg: 'warning' },
          { title: 'Usuarios Bloqueados', value: userStats.blockedUsers, bg: 'danger' },
          { title: 'Administradores', value: userStats.adminsCount, bg: 'info' }
        ].map((stat, index) => (
          <div key={index} className={`col-md-${index < 3 ? '4' : '6'} mb-3`}>
            <div className={`card text-white bg-${stat.bg} h-100`}>
              <div className="card-body">
                <h5 className="card-title">{stat.title}</h5>
                <p className="card-text display-4">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="row">
        <h2 className="mb-3">Intentos de Inicio de Sesión Fallidos</h2>
        
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Total Intentos Fallidos</h5>
              <p className="card-text display-4 text-danger">
                {loginStats.totalFailedAttempts}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Top Usuarios con más fallos</h5>
              {loginStats.failedAttemptsByUser.length > 0 ? (
                <ul className="list-group">
                  {loginStats.failedAttemptsByUser.slice(0, 5).map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {user.username}
                      <span className="badge bg-danger rounded-pill">{user.attempts}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-info mb-0">No hay registros de intentos fallidos</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;