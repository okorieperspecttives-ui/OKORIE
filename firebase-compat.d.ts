type FirebaseAuthResult = {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
};

type FirebaseAuthProvider = {
  setCustomParameters: (params: Record<string, string>) => void;
};

type FirebaseAuth = {
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseAuthResult>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseAuthResult>;
  signInWithPopup: (provider: FirebaseAuthProvider) => Promise<FirebaseAuthResult>;
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
