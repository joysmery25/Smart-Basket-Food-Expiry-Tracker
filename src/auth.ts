import { signInWithPopup, UserCredential, AuthError } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};
