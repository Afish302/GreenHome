import {createContext,useContext} from 'react';

export const AuthContext = createContext(null);

export function useAuth()   {
    const context = useContext(AuthContext);
    //Throw error if context is null
    if (!context){
        throw new Error('useAuth must be used inside <AuthProvider> (see main.jsx)')
    }
    return context;
}