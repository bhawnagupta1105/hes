import { useState, useRef, useEffect } from "react";

const opexMonth = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" }
];

const MonthDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)} 
        
        className="w-full border rounded-xl px-4 py-2 text-left focus:ring-2 focus:ring-indigo-500"
      >
        {value ? opexMonth.find((m) => m.id === value)?.name
          : "Select Month"}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border rounded-xl bg-white shadow-lg">
          {opexMonth.map((month) => (
            <div
              // key={opexMonth}
              key={month.id} 
              onClick={() => {
                onChange(month.id);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-indigo-100 ${
                value === month.id ? "bg-indigo-500 text-white" : ""
              }`}
            >
              {month.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthDropdown;
