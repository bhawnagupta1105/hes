import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InvoiceForm from "../InvoiceForm/Invoice";
import { PlusIcon } from "@heroicons/react/24/solid";
import { loadConfig } from "../../config";
const CardModal = ({ show, onClose, title, children, onInvoiceAdded }) => {
  // Prevent background scroll and handle Escape key
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";

    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (show) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [show, onClose]);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  //const CORRECT_PASSWORD = "admin123"; // Change this to your desired password
  const [config, setConfig] = useState({});
    useEffect(() => {
    loadConfig().then(setConfig).catch(console.error);
  }, []);

  const handleAddClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = () => {
    if (password === config.CONFIG_PASSWORD) {
      setShowPasswordPrompt(false);
      setShowForm(true);
      setPassword("");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y  : 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition"
              aria-label="Close modal"
            >
              ✕
            </button>
<div className="flex items-center justify-between mb-4 px-8 mr-1">
  <h2 className="text-xl font-bold">{title} Details</h2>
  
  {!showForm && title?.toLowerCase().includes("invoice count") && (
    <button
      onClick={handleAddClick}
      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition flex items-center gap-1 "
    >
      Add
      <PlusIcon className="w-5 h-5" />
    </button>
  )}
</div>

           {showPasswordPrompt && (
             <motion.div
               className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowPasswordPrompt(false)}
             >
               <motion.div
                 className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative"
                 initial={{ scale: 0.8, opacity: 0, y: 50 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.8, opacity: 0, y: 50 }}
                 transition={{ duration: 0.3 }}
                 onClick={(e) => e.stopPropagation()}
               >
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Enter Password</h3>
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter password"
                   className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                 />
                 <div className="flex gap-2">
                   <button
                     onClick={handlePasswordSubmit}
                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex-1"
                   >
                     Submit
                   </button>
                   <button
                     onClick={() => setShowPasswordPrompt(false)}
                     className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex-1"
                   >
                     Cancel
                   </button>
                 </div>
               </motion.div>
             </motion.div>
           )}

           {showForm && (
                     <motion.div
                       className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       onClick={() => setShowForm(false)}
                     >
                       <motion.div
                         className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg sm:max-w-xl md:max-w-2xl relative max-h-[90vh] overflow-y-auto"
                         initial={{ scale: 0.8, opacity: 0, y: 50 }}
                         animate={{ scale: 1, opacity: 1, y: 0 }}
                         exit={{ scale: 0.8, opacity: 0, y: 50 }}
                         transition={{ duration: 0.3 }}
                         onClick={(e) => e.stopPropagation()}
                       >
                         {/* Close Button */}
                         <button
                           onClick={() => setShowForm(false)}
                           className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition"
                         >
                           ✕
                         </button>
           
                         {/* Header */}
                         <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                           Add Invoice
                         </h2>
           
                         {/* Form */}
                         <InvoiceForm onInvoiceAdded={onInvoiceAdded} />
                       </motion.div>
                     </motion.div>
                   )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardModal;
