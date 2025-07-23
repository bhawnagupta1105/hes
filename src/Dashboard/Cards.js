
import Card from 'react-bootstrap/Card';

const CardValues = ({colour,image,Value,Title}) => {
    return( 
    <Card className = {`border-solid rounded-md ${colour} w-full h-full shadow-md p-4 mr-4 mb-4`}>
    <div className= "flex items-center justify-between">
    <i className={`${image} opacity-25 text-white`}></i>
    <div class="text-right">

    <Card.Text className = "">{Value}</Card.Text>
    <Card.Text className = "italic">{Title}</Card.Text>
    </div>

    </div>

</Card>
    )
}

const Cards = () =>{
    const cards = [
        {colour:'bg-blue-500',image:'fa fa-tachometer fa-4x  ',Value:'20',Title:'Total Meters'},
        {colour:'bg-red-400',image:'fa fa-exclamation-triangle fa-4x',Value:'0',Title:'Power Outages'},
        {colour:'bg-violet-500',image:'fa fa-bug fa-4x',Value:'0',Title:'Tampered Meters'},
        {colour:'bg-fuchsia-600',image:'fa fa-exclamation-triangle fa-4x',Value:'0',Title:'Meter ESW Notifications'},
        {colour:'bg-emerald-500',image:'fa fa-cloud-download fa-4x',Value:'4',Title:'Communicatd Today'},
        {colour:'bg-stone-500',image:'fa fa-tachometer fa-4x',Value:'0',Title:'Manual Read Today'},
        {colour:'bg-yellow-500',image:'fa fa-bolt fa-4x',Value:'15',Title:'Offline Since seven days'},
    ];
return(
    <div className= "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {cards.map((item,i) =>(

        <CardValues key={i} colour={item.colour} image = {item.image} Value={item.Value} Title = {item.Title} ></CardValues>
        ))}

    </div>
)
}

export default Cards;