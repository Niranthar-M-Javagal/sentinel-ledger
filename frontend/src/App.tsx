import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Fraud from "./pages/Fraud";
import Accounts from "./pages/Accounts";
import Blacklist from "./pages/Blacklist";
import Activity from "./pages/Activity";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Dashboard />}
            />

            <Route
                path="/transactions"
                element={<Transactions />}
            />

            <Route
                path="/fraud"
                element={<Fraud />}
            />

            <Route
                path="/accounts"
                element={<Accounts />}
            />

            <Route
                path="/blacklist"
                element={<Blacklist />}
            />

            <Route
                path="/activity"
                element={<Activity />}
            />
        </Routes>
    );
}

export default App;