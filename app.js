// Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDC3aVYPv57JyMHLfcV-OXb5ilsJJnsvlM",
  authDomain: "project-2082277388872876828.firebaseapp.com",
  databaseURL: "https://project-2082277388872876828-default-rtdb.firebaseio.com",
  projectId: "project-2082277388872876828",
  storageBucket: "project-2082277388872876828.firebasestorage.app",
  messagingSenderId: "557947332806",
  appId: "1:557947332806:web:8704cd145a87b4dcb64fc7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Google 登入邏輯
document.getElementById("googleSignIn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    };

    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, userData); // 註冊
    } else {
      await update(userRef, { lastLogin: userData.lastLogin }); // 更新最後登入
    }

    // 顯示用戶資訊
    document.getElementById("userName").innerText = userData.name;
    document.getElementById("userEmail").innerText = userData.email;
    document.getElementById("userPhoto").src = userData.photoURL;
    document.getElementById("lastLogin").innerText = userData.lastLogin;
    document.getElementById("userInfo").style.display = "block";

  } catch (error) {
    console.error("登入失敗:", error);
  }
});