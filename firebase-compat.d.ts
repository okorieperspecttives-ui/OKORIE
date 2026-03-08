type FirebaseAuthResult = {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
};

type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type FirebaseAuthProvider = {
  setCustomParameters: (params: Record<string, string>) => void;
};

type FirebaseAuth = {
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseAuthResult>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseAuthResult>;
  signInWithPopup: (provider: FirebaseAuthProvider) => Promise<FirebaseAuthResult>;
  currentUser?: FirebaseUser | null;
  onAuthStateChanged?: (cb: (user: FirebaseUser | null) => void) => () => void;
  signOut?: () => Promise<void>;
};

type FirebaseCompat = {
  apps: unknown[];
  initializeApp: (config: Record<string, string>) => void;
  auth: (() => FirebaseAuth) & {
    GoogleAuthProvider: new () => FirebaseAuthProvider;
  };
};

declare global {
  interface Window {
    firebase?: FirebaseCompat;
  }
}

export {};
