import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from './Pages/dashboard';
import Home from './Pages/homepage';
import Adminpage from "./Pages/adminpage";
import PayrollReceipt from "./components/payrollReceipt";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/admin" element={<Adminpage />} />
          <Route exact path="/receipt" element={<PayrollReceipt />} />
        </Routes>
      </Router>
    </>

  );
}

export default App;
