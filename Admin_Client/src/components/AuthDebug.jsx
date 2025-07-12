import { useSelector } from 'react-redux'

export default function AuthDebug() {
  const authState = useSelector((state) => state.auth)
  const token = localStorage.getItem('adminToken')
  const user = localStorage.getItem('adminUser')

  if (import.meta.env.DEV) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        fontSize: '12px',
        borderRadius: '5px',
        zIndex: 9999
      }}>
        <div>Auth State Debug:</div>
        <div>isAuthenticated: {String(authState.isAuthenticated)}</div>
        <div>loading: {String(authState.loading)}</div>
        <div>user: {authState.user ? 'Present' : 'Null'}</div>
        <div>token in localStorage: {token ? 'Present' : 'Null'}</div>
        <div>user in localStorage: {user ? 'Present' : 'Null'}</div>
      </div>
    )
  }

  return null
}
