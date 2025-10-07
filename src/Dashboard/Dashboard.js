import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InvoiceForm from "./InvoiceForm/Invoice";
import Cards from "./Cards/Cards";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showForm]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
  <Cards />
</div>


  );
};

export default Dashboard;
