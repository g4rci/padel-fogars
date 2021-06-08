import { db } from "../services/firebase";
import { auth } from "../services/firebase";




export function writeUserData(userId, name, email, imageUrl) {
    db.ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }

  