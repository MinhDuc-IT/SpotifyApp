import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  roles: string[];
  subscriptionType: string;
  setSubscriptionType: (type: string) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  roles: [],
  subscriptionType: 'Free',
  setSubscriptionType: () => {},
});

export default AuthContext;
