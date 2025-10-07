import { useEffect, useState } from "react";
import CardValues from "./CardValues";
import CardModal from "./CardModal";
import InvoiceGrid from "../InvoiceForm/InvoiceGrid";
import { getdashboarddata } from "../../ApiServices/api";


const Cards = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = () => {
    setLoading(true);
    getdashboarddata().then((res)=>{
      console.log(res);
        const formattedCards= res.map((item)=>({
            id:item.DisplayId,
            colour:item.DivClass1,
            image:item.DivClass2,
            Value:item.DisplayValue,
            Title:item.DisplayText,
            orderNumber:item.OrderNumber,
            clickable:item.CanRefresh || false,
            IsVisible:item.IsVisible,
        })).sort((a, b) => a.orderNumber - b.orderNumber);
        setCards(formattedCards);

    })
    .catch((err)=>{
        console.error("Error Fetching dashboard data:",err);
        
    })
    .finally(()=>{
            setLoading(false);
    })
  };

  useEffect(() =>{
    fetchDashboardData();
  },[refreshKey]);

  const handleInvoiceAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

if (loading) {
    return <p className="p-4 text-gray-600">Loading dashboard data...</p>;
  }
//   const cards = [
//     { colour: 'bg-blue-500', image: 'fa fa-tachometer fa-4x', Value: '20', Title: 'Total Meters', clickable: false },
//     { colour: 'bg-red-400', image: 'fa fa-exclamation-triangle fa-4x', Value: '0', Title: 'Power Outages', clickable: true },
//     { colour: 'bg-violet-500', image: 'fa fa-bug fa-4x', Value: '0', Title: 'Tampered Meters', clickable: true },
//     { colour: 'bg-fuchsia-600', image: 'fa fa-exclamation-triangle fa-4x', Value: '0', Title: 'Meter ESW Notifications', clickable: true },
//     { colour: 'bg-emerald-500', image: 'fa fa-cloud-download fa-4x', Value: '4', Title: 'Communicated Today', clickable: true },
//     { colour: 'bg-stone-500', image: 'fa fa-tachometer fa-4x', Value: '0', Title: 'Manual Read Today', clickable: false },
//     { colour: 'bg-yellow-500', image: 'fa fa-bolt fa-4x', Value: '15', Title: 'Offline Since Seven Days', clickable: false },
//   ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {cards.map((item, i) => (
          <CardValues
            key={i}
            colour={item.colour}
            image={item.image}
            Value={item.Value}
            Title={item.Title}
            clickable={item.clickable}
            IsVisible = {item.IsVisible}
            onClick={() => item.route?(window.location.href=item.route): setActiveCard(item)}
          />
        ))}
      </div>

      <CardModal
        show={!!activeCard}
        title={activeCard?.Title}
        onClose={() => setActiveCard(null)}
        onInvoiceAdded={handleInvoiceAdded}
      >
        <InvoiceGrid key={refreshKey} cardTitle={activeCard?.Title} displayValue={activeCard?.Value} />
        
      </CardModal>
    </>
  );
};

export default Cards;
