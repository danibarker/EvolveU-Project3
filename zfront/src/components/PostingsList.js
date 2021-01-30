import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

import PostingAxios from "../services/PostingAxios";
import MainModal from "./MainModal";
import WelcomeModal from "./WelcomeModal";
import RenderStubs from "./RenderStubs";
import retrievePostings from "../functions/retrievePostings";
import deleteAllPostings from "../functions/deleteAllPostings";
import onClickFindByTitle from "../functions/onClickFindByTitle";


const PostingsList = () => {
  const emptyPost = {
    _id: null, //  It'd be better if we used 0
    title: "",
    contributors: "",
    description: "",
    tags: "",
    contentType: "",
    spiciness: 0,
    upvotes: 0,
  };

  const [postingsDataArray, setPostingsDataArray] = useState([emptyPost]);
  const [currPostIndex, setCurrPostIndex] = useState(0); //C: points to the element in the postings array that we're interested in

  const [searchTitle, setSearchTitle] = useState("");
  const [showMainModal, setShowMainModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  
  useEffect(() => {
    retrievePostings(setPostingsDataArray);
  }, []);                                   // C: '[]' means useEffect will only run THE FIRST time the page renders


  const onChangeSearchTitle = (evnt) => {
    setSearchTitle(evnt.target.value);
    console.log("onChangeSearchTitle(): setSearchTitle to:", evnt.target.value);
  };


  // Main Page JSX
  return (
    <div>
      {/* Navbar */}
      <nav className="w-full h-20 flex items-center text-blue-200 bg-blue-900">
        <div className="flex flex-row items-baseline">
          <WelcomeModal show={showWelcomeModal} onHide={() => setShowWelcomeModal(false)} animation={false} />
          <div className="p-2 text-2xl mx-4  hover:text-blue-400" onClick={() => setShowWelcomeModal(true)}>
            Helpful Postings
          </div>

          <div
            className="mx-4 hover:text-blue-400"
            onClick={() => {
              setCurrPostIndex(-1); // use index of -1 to indicate a new, blank modal form
              setShowMainModal(true);
            }}>
            Create Post
          </div>

          {/* Search bar */}
          <div className="flex flex-row mx-4">
            <input
              type="text"
              className="w-100 p-1 text-gray-800 bg-gray-100 rounded-lg"
              placeholder=" Search by Title"
              value={searchTitle}
              onChange={onChangeSearchTitle}></input>
            <button
              className="ml-2 px-3 text-gray-800 bg-gray-300 rounded-lg  hover:text-blue-600"
              onClick={onClickFindByTitle}>
              Search
            </button>
          </div>
        </div>
      </nav>

      <RenderStubs
        postingsDataArr={postingsDataArray}
        setCurrPostIndx={setCurrPostIndex}
        setShowMainModl={setShowMainModal}
      />

      <MainModal
        postingsDataArr={postingsDataArray}
        currPostIndx={currPstIndex}
        setCurrPostIndx={setCurrPostIndex}
        setPostingsDataArr={setPostingsDataArray}
        emptyPst={emptyPost}
      />

      <Button variant="outline-danger" onClick={deleteAllPostings(setPostingsDataArray)}>  {/* Refreshes postingsDataArray */}
        [Dev Only] Remove All
      </Button>
    </div>
  );
};

export default PostingsList;
