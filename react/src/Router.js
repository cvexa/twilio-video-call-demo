import React from "react";
import { BrowserRouter, Routes , Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import ChatScreen from "./ChatScreen";
import App from "./App";

function Router() {
    return (
        <BrowserRouter>
            <Routes >
                <Route exact path="/chat" element={<ChatScreen />} />
                <Route exact path="/home" element={<WelcomeScreen />} />
                <Route exact path="/video" element={<App />} />
            </Routes >
        </BrowserRouter>
    );
}

export default Router;