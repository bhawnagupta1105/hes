import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getinvoicesatformdata,submitInvoice  } from "../../ApiServices/api";
import MonthDropdown from "./MonthDropdown"; // adjust path if needed
import PrettyCalendar from "./PreetyCalender";

const InvoiceForm = ({ onInvoiceAdded }) => {
    const [formData, setFormData] = useState({
        invoiceNumber: "",
        invoiceDate: "",
        opexMonth: 0,
        opexYear: "",
        satNames:"",
    });
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [selected, setSelected] = useState("");
    const [checkedItems, setCheckedItems] = useState([]);
    const [showForm, setShowForm] = useState(true);


    useEffect(() => {
        getinvoicesatformdata().then((res) => {
            debugger
            const formattedData = res.map((item) => ({ 
                label: `${item.SatName}${item.EndDateTime ? " (Closure Date: " + item.EndDateTime +")" : " " }`,
                value: item.SatName,
                endDateTime: item.EndDateTime
            }));
            setAllItems(formattedData);
            setItems(formattedData);
            console.log("resdata:", res);

        })
            .catch((err) => {
                console.error("Error Fetching sat data:", err);
            })
    }, []);

    useEffect(() => {
        debugger
        console.log(formData.invoiceDate);
        if (selected === "Opex" && formData.invoiceDate) {
            const targetDate = new Date(formData.invoiceDate);
            console.log("Target date:", targetDate);
            const filteredItems = allItems.filter(item => {
                if (item.value === "Select All" || !item.endDateTime) return true;
                const closureDate = new Date(item.endDateTime);
                console.log(`Comparing ${item.value}: ${closureDate} < ${targetDate} = ${closureDate < targetDate}`);
                return closureDate <= targetDate;
            });
            console.log("Filtered items:", filteredItems);
            setItems(filteredItems);
            setCheckedItems([]);
        } else {
            setItems(allItems);
        }
    }, [formData.invoiceDate, selected, allItems]);
    //const data = "satName" + " "+ "endDateTime" + "(Closure Date)";
    //const items = ["SAT 1", "SAT 2", "SAT 3", "SAT 4", "SAT N"];

    const handlecheck = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (value === "Select All") {
            if (isChecked) {
                // ✅ Select all including "Select All"
                setCheckedItems(items.map(i => i.value));
            } else {
                // ✅ Unselect all
                setCheckedItems([]);
            }
        } else {
            let updatedChecked;
            if (isChecked) {
                updatedChecked = [...checkedItems, value];
            } else {
                updatedChecked = checkedItems.filter((item) => item !== value);
            }

            // ✅ If all items except "Select All" are checked, add "Select All" too
            if (
                updatedChecked.length === items.length - 1 &&
                !updatedChecked.includes("Select All")
            ) {
                updatedChecked = [...updatedChecked, "Select All"];
            }

            // ✅ If any item is unchecked, remove "Select All"
            if (updatedChecked.length < items.length && updatedChecked.includes("Select All")) {
                updatedChecked = updatedChecked.filter((item) => item !== "Select All");
            }

            setCheckedItems(updatedChecked);
        }
    };


    const handlechange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'invoiceNumber') {
            // Only allow alphanumeric characters, max 20 chars, convert to uppercase
            const sanitizedValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 20);
            setFormData({
                ...formData,
                [name]: sanitizedValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async(e) => {
        debugger
        e.preventDefault();
        let satNamesToSend = checkedItems;

        if (!formData.invoiceDate) {
             alert("Please select an Date");
  return;
}

             if (selected === "Opex" && !formData.opexMonth) {
    alert("Please select an Opex month");
    return;
  }

          if (selected === "Opex" && !formData.opexMonth) {
    alert("Please select an Opex month");
    return;
  }

  // Validate Year
  if (selected === "Opex" && !formData.opexYear) {
    alert("Please enter an Opex year");
    return;
  }

  // Validate checkboxes
  if (selected === "Opex" && checkedItems.length === 0) {
    alert("Please select at least one SAT");
    return;
  }

    if (checkedItems.includes("Select All")) {
        // If "Select All" is checked, replace it with all items except "Select All"
        satNamesToSend = items
            .filter(item => item.value !== "Select All")
            .map(item => item.value);
    }
        const payload = {
            invoiceDate: formData.invoiceDate,
            invoiceNumber: formData.invoiceNumber,
            isCapex: selected === "Capex",  
            isOpex: selected === "Opex",
            opexDetails: selected === "Opex" ? {
                opexMonth: formData.opexMonth,
                opexYear: formData.opexYear,
                satNames: satNamesToSend 
            } : null
        };
// console.log("Payload to submit:", payload);
//     alert("Check console for submitted payload!");
        try {
            const res = await submitInvoice(payload);
            console.log("Invoice saved:", res);
            alert("Invoice submitted successfully!");
            setShowForm(false);
            if (onInvoiceAdded) {
                onInvoiceAdded();
            }
        } catch (err) {
            console.error("Error submitting invoice:", err);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center" >
        {/* <div className="flex items-center justify-center shadow-lg min-h-screen bg-gradient-to-br from-gray-50 via-gray-80 to-gray-60 px-4"> */}
            {/* Animated Form Container */}
            {showForm ?(<motion.form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg bg-gradient-to-br from-gray-50 via-gray-80 to-gray-60 space-y-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Heading */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-800">
                        Invoice Details
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Fill in the details below to submit invoice
                    </p>
                </motion.div>

                {/* Invoice Number */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Number
                    </label>
                    <input
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={handlechange}
                        placeholder="Enter your Invoice Number"
                        maxLength={20}
                        className="w-full border rounded-xl px-4 py-2 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                        required
                    />
                </motion.div>

                {/* Invoice Date */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Date
                    </label>
                    <PrettyCalendar
                        value={formData.invoiceDate}
                        onChange={(date) => setFormData({ ...formData, invoiceDate: date })}
                    />


                </motion.div>

                {/* Radio Options */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Type
                    </p>
                    <div className=" relative flex justify-center gap-6">
                        {["Capex", "Opex"].map((option) => (
                            <label
                                key={option}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={option}
                                    checked={selected === option}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </motion.div>

                {/* Opex Fields with AnimatePresence */}
                <AnimatePresence>
                    {selected === "Opex" && (
                        <motion.div
                            className="space-y-4 border-t pt-4 min-h-[300px]"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Opex Period */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Opex Period
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <MonthDropdown
                                        value={formData.opexMonth}
                                        onChange={(opexMonth) => setFormData({ ...formData, opexMonth: opexMonth })}
                                    />
                                    <input
                                        type="number"
                                        name="opexYear"
                                        value={formData.opexYear}
                                        onChange={handlechange}
                                        placeholder="Year"
                                        min="2000"
                                        max="2099"
                                        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </motion.div>

                            {/* Opex Checkboxes */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Opex Claim of Meters
                                </label>
                                <div className="grid grid-rows-2 sm:grid-rows-3 gap-2">
                                    {items.map((item, idx) => (
                                        <motion.label
                                            key={item.value}
                                            className="flex items-center space-x-2 border p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                        >
                                            <input
                                                type="checkbox"
                                                value={item.value}
                                                checked={checkedItems.includes(item.value)}
                                                onChange={handlecheck}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 text-sm">{item.label}</span>
                                        </motion.label>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md"
                    whileHover={{ scale: 1.05, opacity: 0.9 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Submit
                </motion.button>
            </motion.form>): (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-xl font-bold text-green-600">✅ Invoice Submitted!</h2>
        <p className="text-gray-600 mt-2">Your data has been saved successfully.</p>
      </motion.div>
    )}
        </div>
    );
};

export default InvoiceForm;

