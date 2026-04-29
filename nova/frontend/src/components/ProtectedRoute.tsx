import { Navigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from '@/context/firebaseAuthContext';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useFirebaseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to register, remembering where they wanted to go
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
