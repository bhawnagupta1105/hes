// App.js
import './App.css';
import Navbar from "../src/Header/Navbar";
import Cards from './Dashboard/Cards';
import './index.css'
import MyBar,{chartdatapercentage} from './Dashboard/Charts';
function App() {
  return (
    <div >
      <Navbar />
<Cards></Cards>
<MyBar data = {chartdatapercentage}></MyBar>
    </div>
  );
}

export default App;
