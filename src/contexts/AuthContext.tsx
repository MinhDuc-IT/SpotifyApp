import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  roles: string[];
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  roles: [],
});

export default AuthContext;
