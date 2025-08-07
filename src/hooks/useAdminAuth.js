import { useAuth } from '../context/AuthContext';

export const useAdminAuth = () => {
  const { user, isAuthenticated, loading, isAdmin, logout, refreshUserData } = useAuth();

  return {
    isAdmin: isAdmin(),
    loading,
    user,
    logout,
    refreshUserData
  };
}; 