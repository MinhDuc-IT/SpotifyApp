import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  roles: string[];
  accountType: 'free' | 'premium';
  premiumExpiryDate?: string | null;
  setAccountType?: (type: 'free' | 'premium') => void;
  setPremiumExpiryDate?: (date: string | null) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  roles: [],
  accountType: 'free',
  premiumExpiryDate: null,
  setAccountType: () => {},
  setPremiumExpiryDate: () => {},
});

export default AuthContext;
