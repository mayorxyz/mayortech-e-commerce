import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';
import AdminPage from '@/pages/AdminPage';

export default function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AdminPage /> : <AdminLogin />;
}