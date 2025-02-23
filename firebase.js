import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyD5afL-Mohj4kQwRu7mtaMv-o6qs6AQRTY",
	authDomain: "book-library-60b1e.firebaseapp.com",
	projectId: "book-library-60b1e",
	storageBucket: "book-library-60b1e.firebasestorage.app",
	messagingSenderId: "845622686464",
	appId: "1:845622686464:web:ea9296f8065188bdfbb9e5",
	measurementId: "G-GL7TZYDBX5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let isAuthenticated = false;
const auth = getAuth(app);
const db = getFirestore(app);

const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");

const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInFormElement = document.getElementById("signIn");
const signUpFormElement = document.getElementById("signup");
const signUpBanner = document.querySelector(".auth-banner__signup");
const signInBanner = document.querySelector(".auth-banner__signin");

// add authentication

if (window.location.pathname === "/auth.html") {
	signUpButton.addEventListener("click", function () {
		console.log("clicked sign up");
		signInFormElement.style.display = "none";
		signUpFormElement.style.display = "block";
		signUpBanner.style.display = "none";
		signInBanner.style.display = "block";
	});
	signInButton.addEventListener("click", function () {
		console.log("clicked sign in");
		signInFormElement.style.display = "block";
		signUpFormElement.style.display = "none";
		signUpBanner.style.display = "block";
		signInBanner.style.display = "none";
	});
}

const handleSignUp = async (data) => {
	const { email, password, firstName, lastName, photoURL } = data;
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		const userData = {
			email,
			firstName,
			lastName,
			photoURL,
		};
		const docRef = doc(db, "users", user.uid);

		await setDoc(docRef, userData);
		console.log("user data:", userData);
		console.log("User signed up:", user);
		localStorage.setItem("userId", user.uid);
		isAuthenticated = true;
		window.location.href = "./index.html";
	} catch (error) {
		console.error("Error signing up:", error);
	}
};

const handleSignIn = async (data) => {
	const { email, password } = data;
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		console.log("User signed in:", user);
		localStorage.setItem("userId", user.uid);
		isAuthenticated = true;
		window.location.href = "./index.html";
	} catch (error) {
		console.error("Error signing in:", error);
	}
};

signInForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log(e.target);

	const email = e.target.email.value;
	const password = e.target.password.value;

	const data = {
		email,
		password,
	};

	handleSignIn(data);
	console.log("user:", data);
});

signUpForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log(e.target);

	const firstName = e.target.fName.value;
	const lastName = e.target.lName.value;
	const photoURL = e.target.photoURL.value;
	const email = e.target.rEmail.value;
	const password = e.target.rPassword.value;

	const data = {
		firstName,
		lastName,
		email,
		password,
		photoURL,
	};

	handleSignUp(data);
	console.log("user:", data);
});

const logout = () => {
	localStorage.removeItem("userId");
	signOut(auth);
	isAuthenticated = false;
	window.location.href = "./auth.html";
};

const user = auth.currentUser;

export { auth, logout, user, firebaseConfig };
