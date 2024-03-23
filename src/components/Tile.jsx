import "../styles.css"

var Latex = require('react-latex');

const Tile = ({ type, data, onClick }) => {
    return (
        <div className={`tile-container ${data.isSelected && "highlighted"}`}
             onClick={() => onClick(data.id)}
             title={data.hint}>
            { 
                type === "equation" 
                    ? ( <Latex>{'$' + data.label+ '$'}</Latex>)
                    : data.label 
            }
        </div>
    );
}

export default Tile;