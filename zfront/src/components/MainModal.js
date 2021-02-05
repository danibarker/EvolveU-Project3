import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import convertISODate from "../functions/convertISODate";
import retrievePostings from "../functions/retrievePostings";
import createPostOnDB from "../functions/createPostOnDB";
import updatePostOnDB from "../functions/updatePostOnDB";
import deletePostFromDB from "../functions/deletePostFromDB";
import createPostOnDataArray from "../functions/createPostOnDataArray";
import updatePostOnDataArray from "../functions/updatePostOnDataArray";
import deletePostFromDataArray from "../functions/deletePostFromDataArray";


const MainModal = (props) => {

  const emptyPost = props.emptyPost;
  let currPostIndex = props.currPostIndex;
  let showMainModal = props.showMainModal;
  const setShowMainModal = props.setShowMainModal;
  let postingsDataArray = props.postingsDataArray;
  const setPostingsDataArray = props.setPostingsDataArray;
  let postDraft = props.postDraft;
  const setPostDraft = props.setPostDraft;
  let creatingPostFlag = props.creatingPostFlag;


  // console.log("MainModal.js Begins.");

  const handleInputChange = (evnt) => {       //J: This could be called updatePostDraft()
    const { name, value } = evnt.target;

    setPostDraft((currDraft) => {
      const newPostDraft = { ...currDraft, [name]: value };
      // Brackets [] around 'name' are so the VALUE of name is used for the key and not just the string 'name'.
      console.log("MainModal.js: handleInputChange: setting postDraft to", newPostDraft);
      return newPostDraft;
   });
  };


  return (
    <>
      <Modal size="lg" centered show={showMainModal} animation={false} onHide={() => { 
        setShowMainModal(false);
      }}>

        <Modal.Body>
          <>
            <input
              name="title"
              type="text"
              required
              className="text-xl w-full p-1 font-500 focus:bg-gray-200 hover:bg-gray-200"
              placeholder="Enter title of posting here"
              value={postDraft.title}
              onChange={handleInputChange}   // Try onBlur? Also, it'd be nice if pressing Enter acted like pressing Tab
            />
          </>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Contributors:</div>        {/* font-500 is James' Tailwind for bold */}
            <input
              name="contributors"
              type="text"
              required
              className="modalField"
              placeholder="Enter names of contributors here (Firstname, last Initial)"
              value={postDraft.contributors}
              onChange={handleInputChange}
            />
          </div>

          { ((postDraft?.createdAt) && (postDraft.updatedAt)) ?     // If there aren't any dates, just skip this
            <>
              <div className="flex flex-row p-1 mt-2">   {/* Dates are read-only, and only shown for existing posts */}

                <div className="flex flex-row">
                  <div className="font-500">Created:</div>
                  <div className="ml-2 font-400">{convertISODate(postDraft.createdAt)}</div>
                </div>

                <div className="flex flex-row ml-6">
                  <div className="font-500">Modified:</div>
                  <div className="ml-2 font-400">{convertISODate(postDraft.updatedAt)}</div>
                </div>
              </div>
            </>
            : 
            <></>
          }

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Tags:</div>
            <input
              name="tags"
              type="text"
              required
              className="modalField"
              placeholder="Enter tags/keywords here"
              value={postDraft.tags}
              onChange={handleInputChange}
            />
          </div>

          <input
            name="description"                              //J: I'd like to change this to "content" 
            type="text"
            required
            className="modalField"
            placeholder="Enter content of post here"
            value={postDraft.description}                   //J: I'd like to change this to ".content" 
            onChange={handleInputChange}
          />

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Content Type:</div>
            <input
              name="contentType"
              type="text"
              required
              className="modalField"
              placeholder="Enter type of content (Text, file, etc.)"
              value={postDraft.contentType}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                name="spiciness"
                required
                className="modalField"
                value={postDraft.spiciness}
                defaultValue="Spiciness"
                onChange={handleInputChange}
              >
                Spiciness
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1" value="1">Mild</Dropdown.Item>
                <Dropdown.Item href="#/action-2" value="2">Medium</Dropdown.Item>
                <Dropdown.Item href="#/action-3" value="3">Spicy</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Upvotes:</div>          {/*J: Need to add Collin's counter code here */}
          </div>
        </Modal.Body>


        <Modal.Footer>
          <Button
            variant="warning"
            onClick={ () => { 
              console.log("MainModal.js Clicked Abandon Changes")
              setShowMainModal(false);
          }}>
            Abandon Changes
          </Button>


          <Button
            variant="danger"
            onClick={() => {      // Only delete if editing an existing post
              console.log("MainModal.js Clicked Delete Post")
              if (!creatingPostFlag && (postingsDataArray?.[currPostIndex]?._id)) {
                console.log("MainModal.js Clicked Delete Post creatingPostFlag=", creatingPostFlag);
                console.log("MainModal.js Clicked Delete Post postDraft=", postDraft);
                console.log("MainModal.js Clicked Delete Post postingsDataArray=", postingsDataArray);

                deletePostFromDB(postingsDataArray, currPostIndex);
                deletePostFromDataArray(postingsDataArray, setPostingsDataArray, currPostIndex);
              } else {
                console.log("MainModal.js 'Delete Post' clicked but creating a post, or postingsDataArray[currentPostIndex] has bad ._id")
                // retrievePostings(setPostingsDataArray, emptyPost);  // Time for a hard-update
                // deletePostFromDB(postingsDataArray, currPostIndex);
                // deletePostFromDataArray(postingsDataArray, setPostingsDataArray, currPostIndex);
              }

              setShowMainModal(false);
            }}>
            Delete Post       {/* Add an icon? */}
          </Button>


          <Button
            color="green"
            type="submit"
            onClick={ () => {
              console.log("MainModal.js Clicked 'Save Post' creatingPostFlag=", creatingPostFlag);
              console.log("MainModal.js Clicked 'Save Post' postDraft=", postDraft);
              console.log("MainModal.js Clicked 'Save Post' postingsDataArray=", postingsDataArray);

              if (creatingPostFlag) {
                console.log("MainModal.js creatingPostFlag=true so running createPostOnDB and createPostOnDataArray")
                createPostOnDataArray(setPostingsDataArray, postDraft);
                createPostOnDB(postDraft)
                  .then((response) => {
                    console.log("MainModal.js Clicked 'Save Post' NOT creatingPost createPostOnDB response=",response)
                    retrievePostings(setPostingsDataArray, emptyPost);   // Time for a hard-update
                })
              } else {
                // if (postingsDataArray && postingsDataArray[currPostIndex] && postingsDataArray[currPostIndex]._id) {
                if (postingsDataArray?.[currPostIndex]?._id) {
                  console.log("MainModal.js NOT creatingPost so running updatePostOnDB and updatePostOnDataArray")
                  updatePostOnDataArray(setPostingsDataArray, postDraft, currPostIndex)

                  updatePostOnDB(postDraft, currPostIndex)
                    .then((response) => {
                      console.log("MainModal.js Clicked 'Save Post' NOT creatingPost updatePostOnDB response=",response)
                      retrievePostings(setPostingsDataArray, emptyPost);   // Time for a hard-update
                  })
                } else {
                  console.log("MainModal.js 'Save Post' clicked but postingsDataArray[currentPostIndex] has bad ._id!!")
                  // retrievePostings(setPostingsDataArray, emptyPost);   // Time for a hard-update
                  // updatePostOnDB(postDraft, currPostIndex)
                  // updatePostOnDataArray(setPostingsDataArray, postDraft, currPostIndex)
                }
              }
              setShowMainModal(false);
            }}>
            Save Post         {/* Add an icon? */}
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainModal;
