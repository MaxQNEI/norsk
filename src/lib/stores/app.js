import { writable } from "svelte/store";

export let welcomeDisplayed = writable(false);

export let db = writable(JSON.parse(localStorage.getItem("db") ?? "{}"));
db.subscribe((value) => localStorage.setItem("db", JSON.stringify(value)));
