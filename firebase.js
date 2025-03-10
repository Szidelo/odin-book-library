import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import mockBooks from "./mockBooks.js";

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

// add authentication

if (window.location.pathname === "/auth.html") {
	const signUpForm = document.getElementById("signUpForm");
	const signInForm = document.getElementById("signInForm");
	const signUpButton = document.getElementById("signUpButton");
	const signInButton = document.getElementById("signInButton");
	const signInFormElement = document.getElementById("signIn");
	const signUpFormElement = document.getElementById("signup");
	const signUpBanner = document.querySelector(".auth-banner__signup");
	const signInBanner = document.querySelector(".auth-banner__signin");

	signUpButton.addEventListener("click", function () {
		signInFormElement.style.display = "none";
		signUpFormElement.style.display = "flex";
		signUpBanner.style.display = "none";
		signInBanner.style.display = "block";
	});
	signInButton.addEventListener("click", function () {
		signInFormElement.style.display = "flex";
		signUpFormElement.style.display = "none";
		signUpBanner.style.display = "block";
		signInBanner.style.display = "none";
	});

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

			// Store user info in Firestore
			const docRef = doc(db, "users", user.uid);
			await setDoc(docRef, userData);

			// Correct Firestore reference for books subcollection
			const booksCollectionRef = collection(db, "users", user.uid, "books");

			// Add mock books to the user's collection
			for (const book of mockBooks) {
				await addDoc(booksCollectionRef, book);
			}

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
			localStorage.setItem("userId", user.uid);
			isAuthenticated = true;
			window.location.href = "./index.html";
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	signInForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const email = e.target.email.value;
		const password = e.target.password.value;

		const data = {
			email,
			password,
		};

		handleSignIn(data);
	});

	signUpForm.addEventListener("submit", (e) => {
		e.preventDefault();

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
	});
}

const logout = () => {
	localStorage.removeItem("userId");
	signOut(auth);
	isAuthenticated = false;
	window.location.href = "./auth.html";
};

const user = auth.currentUser;

export { auth, logout, user, firebaseConfig };
