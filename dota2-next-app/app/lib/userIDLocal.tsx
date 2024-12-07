import { v4 as uuidv4 } from 'uuid';
var userID;
if (typeof window !== "undefined") {
  userID = localStorage.getItem("userID");
  if (!userID) {
    localStorage.setItem("userID", uuidv4());
  }
}


export default userID;