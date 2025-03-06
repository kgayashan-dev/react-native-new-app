import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react-native"

// CustomDropdown component
const CustomDropdown = ({ label, data, onSelect, selectedValue, disabled = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-700 mb-1">{label}?</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setVisible(!visible)}
          disabled={disabled}
          className={`w-full px-3 py-3 text-left border rounded-md flex justify-between items-center ${
            disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 cursor-pointer hover:bg-gray-50"
          }`}
        >
          <span>
            {selectedValue
              ? data.find(item => item.value === selectedValue)?.label || selectedValue
              : "Select an option"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {visible && (
          <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
            <ul className="py-1">
              {data.map((item) => (
                <li key={item.value}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                    onClick={() => {
                      onSelect(item.value);
                      setVisible(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Header component
const Header = ({ title, showBackButton }) => (
  <div className="bg-blue-600 flex justify-between items-center p-4 w-full">
    <div className="flex items-center">
      {showBackButton && (
        <button className="mr-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <h1 className="text-white font-bold text-lg">{title}</h1>
    </div>
    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
      <span className="text-blue-600 font-bold">A</span>
    </div>
  </div>
);

const MFReceiptLogin = () => {
  const [cashierBranch, setCashierBranch] = useState("");
  const [loanBranch, setLoanBranch] = useState("");
  const [center, setCenter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("idle");

  useEffect(() => {
    // If center is selected, auto-populate the branches based on API data
    if (center) {
      setApiStatus("loading");
      // Simulate API call
      setTimeout(() => {
        setCashierBranch("branch1");
        setLoanBranch("branchA");
        setApiStatus("success");
      }, 1000);
    }
  }, [center]);

  const handleSubmit = () => {
    if (!center) {
      setErrorMessage("Please select a center");
      return;
    }
    
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a username");
      return;
    }
    
    setErrorMessage("");
    setApiStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitted:", { cashierBranch, loanBranch, center, searchQuery });
      setApiStatus("success");
      // Handle success navigation or feedback here
    }, 1500);
  };

  const cashierBranches = useMemo(
    () => [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
    ],
    []
  );

  const loanBranches = useMemo(
    () => [
      { label: "Branch A", value: "branchA" },
      { label: "Branch B", value: "branchB" },
    ],
    []
  );

  const centers = useMemo(
    () => [
      { label: "Center 1", value: "center1" },
      { label: "Center 2", value: "center2" },
    ],
    []
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="MF Receipt" showBackButton={true} />
      
      <div className="p-5 flex-1">
        <p className="text-black text-sm font-light py-6">
          Select the options given below to take the receipts list.
        </p>

        <CustomDropdown
          label="Select Cashier Branch"
          data={cashierBranches}
          onSelect={setCashierBranch}
          selectedValue={cashierBranch}
          disabled={true}
        />

        <CustomDropdown
          label="Select Loan Branch"
          data={loanBranches}
          onSelect={setLoanBranch}
          selectedValue={loanBranch}
          disabled={true}
        />

        <CustomDropdown
          label="Select Center"
          data={centers}
          onSelect={setCenter}
          selectedValue={center}
        />

        <label className="block text-sm text-gray-700 mb-1">Search by Id, </label>
        <input
          type="text"
          className={`w-full px-3 py-3 border rounded-md text-sm ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } ${
            apiStatus === "loading" ? "bg-gray-100 text-gray-500" : "bg-white text-gray-800"
          }`}
          placeholder="Enter your id or name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          disabled={apiStatus === "loading"}
        />
        
        {errorMessage && (
          <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={apiStatus === "loading"}
          className={`w-full mt-5 py-4 rounded-md font-bold text-sm flex items-center justify-center ${
            apiStatus === "loading" ? "bg-gray-200 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {apiStatus === "loading" ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default MFReceiptLogin;