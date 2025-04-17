import  { useState,  useRef } from "react";
import Fuse from "fuse.js";


const SearchAutocomplete = ({ products, setFilteredProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.4,
    includeScore: true,
  });

  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    setActiveIndex(-1);

    if (query.length > 0) {
      const result = fuse.search(query, { limit: 5 });
      const matchedNames = result.map((r) => r.item.name);
      setSuggestions(matchedNames);

      const filtered = products.filter((product) =>
        matchedNames.includes(product.name)
      );
      setFilteredProducts(filtered);
    } else {
      setSuggestions([]);
      setFilteredProducts(products);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSuggestionClick(suggestions[activeIndex]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="What are you looking for?"
        className="w-full p-4 pl-12 rounded-full bg-black bg-opacity-40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4AA3BA] backdrop-blur-md"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-black bg-opacity-50 backdrop-blur-lg text-white shadow-lg rounded-xl mt-2 z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              ref={index === activeIndex ? suggestionsRef : null}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                index === activeIndex
                  ? "bg-[#4AA3BA] text-black"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
