import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const PrettyCalendar = ({ value, onChange }) => {
  const [selected, setSelected] = useState(value ? new Date(value) : undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        readOnly
        value={selected ? selected.toLocaleDateString() : ""}
        onClick={() => setOpen(!open)}
        placeholder="Select Invoice Date"
        className="w-full border rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
      />

      <AnimatePresence>
        {open && (  
          <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
  className="absolute z-10 mt-2 left-0 w-full flex justify-center"
>
  <div
    className="bg-gradient-to-b from-white/95 to-gray-100/95 shadow-xl border border-gray-200 rounded-2xl p-4 ring-1 ring-gray-200
bg-radial-[at_50%_75%] from-[rgba(135,206,250,0.5)] via-[rgba(83, 138, 228, 0.5)] to-[rgba(135, 130, 231, 0.5)]"
    style={{ backdropFilter: "blur(8px)" }}
  >
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
        if (date) onChange(date.toISOString().split("T")[0]);
        setOpen(false);
      }}
      disabled={{ after: new Date() }}
    />
  </div>
</motion.div>

        )}
      </AnimatePresence>
    </div>
  );
};

export default PrettyCalendar;
