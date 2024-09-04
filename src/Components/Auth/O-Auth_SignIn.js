import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const googleSignIn = async (auth, googleProvider) => {
  try{
    const result = await signInWithPopup(auth, googleProvider)
    // console.log(result);
    return {
      token: result._tokenResponse.idToken,
      provider: result._tokenResponse.providerId,
      user: {
        username: result._tokenResponse.displayName,
        email: result._tokenResponse.email,
        avatarURL: result._tokenResponse.photoUrl,
        name: result._tokenResponse.displayName,
      }
    }
  
  }
  catch(err){
    console.log(err)
    throw new Error(err.message)
  }
}