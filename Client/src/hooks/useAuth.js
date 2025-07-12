import { useAuth } from '../context/AuthContext.jsx';

export default function useAuthHook() {
  const auth = useAuth();
  
  return {
    ...auth,
    isLoggedIn: auth.isAuthenticated,
    currentUser: auth.user
  };
}
