import { ReactNode } from 'react'
import { Navigate } from 'react-router'

interface ProtectedRouteProps {
    children : ReactNode
}

export default function ProtectedRoute({children} : ProtectedRouteProps) {

  // Zustand code
  // const token = useAuthStore((state) => state.token)
  // return token ? children : <Navigate to="/signin" />

    const loggedIn = false
    if (!loggedIn) {
       return <Navigate to="/signin" /> 
    }

  return (
    <>
    {children}
    </>
  )
}
