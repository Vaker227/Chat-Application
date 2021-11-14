import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";

import SearchModal from "./search-modal.jsx";

function Search() {
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const handleFocus = () => {
    setIsSearching(true);
  };
  const handleBlur = () => {
    setIsSearching(false);
  };
  const handleSearchModalShow = (e) => {
    if (e) {
      setShowSearchModal(true);
      return;
    }
    setShowSearchModal(false);
  };
  return (
    <div className="w-100 py-3 bg-light">
      <div id="search-bar" className={`d-inline ${isSearching ? "focus" : ""}`}>
        <i className="fas fa-search me-1 text-warning"></i>
        <input
          type="text"
          placeholder="Search"
          id="search-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {isSearching ? (
        <div className="text-btn">Close</div>
      ) : (
        <>
          <i
            className="fas fa-user-plus text-btn"
            onClick={handleSearchModalShow}
            title="Thêm bạn"
          ></i>
          <i className="fas fa-users text-btn" title="Tạo nhóm"></i>
        </>
      )}
      <SearchModal
        isShow={showSearchModal}
        turnOff={() => handleSearchModalShow()}
      />
    </div>
  );
}

export default Search;
