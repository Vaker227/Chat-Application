import React, { useState } from "react";
import { Badge, Button } from "react-bootstrap";

import SearchModal from "./search-modal.jsx";
import CreateGroupModal from "./create-group-modal.jsx";
import { connect } from "react-redux";

function Search(props) {
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const handleFocus = () => {
    setIsSearching(true);
  };
  const handleBlur = () => {
    setIsSearching(false);
  };
  const handleCreateGroupModalShow = (e) => {
    if (e) {
      setShowCreateGroupModal(true);
      return;
    }
    setShowCreateGroupModal(false);
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
            onClick={() => props.toggleSearchModal(true)}
            title="Thêm bạn"
          ></i>
          <i
            className="fas fa-users text-btn"
            onClick={handleCreateGroupModalShow}
            title="Tạo nhóm"
          ></i>
        </>
      )}
      <SearchModal
        isShow={props.view.searchModal}
        turnOff={() => props.toggleSearchModal(false)}
      />
      <CreateGroupModal
        isShow={showCreateGroupModal}
        turnOff={() => handleCreateGroupModalShow()}
      />
    </div>
  );
}

const SearchSTP = (state) => {
  return { view: state.view };
};
const SearchDTP = (dispatch) => {
  return {
    toggleSearchModal: function (value) {
      return dispatch({ type: "TOGGLE_SEARCH_MODAL", data: value });
    },
  };
};
const SearchReduxed = connect(SearchSTP, SearchDTP)(Search);

export default SearchReduxed;
