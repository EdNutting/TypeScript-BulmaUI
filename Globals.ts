/// <reference path="App.ts" />

declare var app: App;
declare var currentUser: {
    id: number;
    loggedIn: boolean;
    profile: { role: string };
};