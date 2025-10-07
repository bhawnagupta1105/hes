import Card from "react-bootstrap/Card";

const CardValues = ({ colour, image, Value, Title, clickable, IsVisible, onClick }) => {

  if (!IsVisible) return null;
  
  return (
    <Card
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : "presentation"}
      aria-pressed={clickable ? "false" : undefined}
      className={`border-solid rounded-md ${colour} w-full h-full shadow-md p-4 transition transform hover:scale-105 cursor-${
        clickable ? "pointer" : "default"
      }`}
    >
      <div className="flex items-center justify-between">
        <i className={`${image} opacity-25 text-white`}></i>
        <div className="text-right">
          <Card.Text className="text-white text-lg font-bold">{Value}</Card.Text>
          <Card.Text className="italic text-white">{Title}</Card.Text>
        </div>
      </div>
    </Card>
  );
};

export default CardValues;
