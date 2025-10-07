// import { useState } from "react";
// const RadioButton = () => {

//     const [selected, setSelected] = useState("");
//     const [checkedItems,setCheckedItems] =useState([]);
//     const items = ["SAT 1","SAT 2","SAT 3","SAT 4","SAT N"];

//     const handlecheck = (e) =>{
//         const value = e.target.value;
//         if(e.target.checked){
//             setCheckedItems([...checkedItems,value])
//         }else{
//             setCheckedItems(checkedItems.filter((item) => item !== value))
//         }
//     }
//     return (
//         <div>
//             <div>
//                 <div className="space-y-3">
//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="radio"
//                             name="choice"
//                             value="Capex"
//                             checked={selected === "Capex"}
//                             onChange={(e) => setSelected(e.target.value)}
//                             className="text-blue-500 focus:ring-blue-400"
//                         >
//                         </input>
//                         <span>Capex</span>
//                     </label>
//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="radio"
//                             name="choice"
//                             value="Opex"
//                             checked={selected === "Capex"}
//                             onChange={(e) => setSelected(e.target.value)}
//                             className="text-blue-500 focus:ring-blue-400"
//                         >
//                         </input>
//                         <span>Opex</span>
//                     </label>
//                 </div>
//             </div>
//             {selected === "Opex" && (
//                 <div>
//                     <form
//                         className="bg-white p-6 rounded-2xl shadow-md w-96">
//                         {/* <div>
//                             <h2>Opex Period</h2>
//                         </div> */}
//                         <div className="mb-4">
//                             <label className="block text-gray-700 mb-1" >Opex Period</label>
//                             <input
//                                 type="text"
//                                 name="opexmonth"
//                                 value={formData.opexMonth}
//                                 //onChange={handlechange}
//                                 placeholder="Enter your Opex Month"
//                                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
//                             ></input>
//                              <input
//                                 type="text"
//                                 name="openyear"
//                                 value={formData.opexYear}
//                                 //onChange={handlechange}
//                                 placeholder="Enter your Opex Year"
//                                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
//                             ></input>
//                         </div>
//                         <div className="mb-4">

//                             {items.map((item) = (
//                                 <label className="block text-gray-700 mb-1">
//                             <input
//                                 type="checkbox"
//                                 value={item}
//                                 checked = {checkeditems.include(items)}
//                                 onChange={handlecheck}
//                                 className="text-blue-500 focus:ring-blue-400"
//                             ></input>
//                             </label>
//                             ))}
//                         </div>
//                     </form>
//                 </div>

//             )}
//         </div>

//     )
// }
// export default RadioButton;