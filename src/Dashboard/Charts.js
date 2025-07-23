import { Note } from '@mui/icons-material';
import { ResponsiveBar } from '@nivo/bar'

 const chartdata = [
  {
    "Communicating": 456789,
    "Non-Communicating": 323455,
  },
  {
   "Communicating": 356789,
    "Non-Communicating": 13455,
  },
  {
    "Communicating": 756789,
    "Non-Communicating": 3455,
  },
  {
    "Communicating": 256789,
    "Non-Communicating": 3455,
  },
  {
    "Communicating": 254567,
    "Non-Communicating": 543455,
  },
  {
    "Communicating": 86789,
    "Non-Communicating": 3455,
  },
  {
    "Communicating": 16789,
    "Non-Communicating": 543455,
  }
]
export const chartdatapercentage = chartdata.map((item,index)=>{
    const total = item.Communicating +item['Non-Communicating'];
    return{
        index:`Item ${index +1}`,
        Communicating:parseFloat(((item.Communicating/total)*100).toFixed(2)),
        "Non-Communicating":parseFloat(((item["Non-Communicating"] / total) * 100).toFixed(2)),
        totalMeters:total

    }
})
const MyBar = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={["Communicating", "Non-Communicating"]}
        indexBy="index"
        colors={({ id, data }) => id === "Communicating" ? "#4CAF50" : "#F44336"} 
        labelSkipWidth={0}
        labelSkipHeight={0}
        //enableTotals={true}
        //label={(v) => `${v.value}%`}
        maxValue={100}
        groupMode='stacked'
         annotations={data.map((item) => ({
      type: 'text',
      match: { index: item.index },
      noteX: 0,
      noteY: -40, // More spacing from the top
      note: `${item.totalMeters} Meters`,
      offset: 0,
      align: 'middle',
    }))}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'row',
                translateY: 50,
                itemsSpacing: 10,
                itemWidth: 120,
                itemHeight: 20,
                symbolSize: 20,
            }
            
        ]}
        //axisBottom={{ legend: 'Communicating,Non-Communicating', legendOffset: 32 }}
        //axisLeft={{ legend: 'food', legendOffset: -40 }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    />
)
export default MyBar;