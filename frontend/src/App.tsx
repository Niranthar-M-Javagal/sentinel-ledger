import { Routes, Route } from "react-router-dom";
import Treasury from "./pages/Treasury";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Fraud from "./pages/Fraud";
import Accounts from "./pages/Accounts";
import Blacklist from "./pages/Blacklist";
import Activity from "./pages/Activity";
import AccountDetails from "./pages/AccountDetails";
import Operations from "./pages/Operations"
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

            <Route
                path="/accounts/:id"
                element={<AccountDetails />}
            />

            <Route
                path="/treasury"
                element={<Treasury />}
            />

            <Route
                path="/operations"
                element={<Operations />}
            />
        </Routes>
    );
}

export default App;