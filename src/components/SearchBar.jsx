import "../styles.css"

const SearchBar = ({ value, onChange}) => {
    return (
        <div className="search-bar-container">
            <input className="search-bar" 
                   type="search" 
                   placeholder="Search for a quantity..." 
                   value={value}
                   onChange={onChange}
            />
        </div>
    );
}

export default SearchBar;