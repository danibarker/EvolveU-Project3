import React, { useState } from "react";
import PostingAxios from "../services/PostingAxios";

const AddPosting = () => {
  const initialPostingState = {
    id: null,
    title: "",
    authors: "",
    description: "",
    published: false
  };
  const [posting, setPosting] = useState(initialPostingState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPosting({ ...posting, [name]: value });
  };

  const savePosting = () => {
    var data = {
      title: posting.title,
      authors: posting.authors,
      description: posting.description
    };

    PostingAxios.create(data)
      .then(response => {
        setPosting({
          id: response.data.id,
          title: response.data.title,
          authors: response.data.author,
          description: response.data.description,
          published: response.data.published
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newPosting = () => {
    setPosting(initialPostingState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newPosting}>
            Add
          </button>
        </div>
      ) : (

        // We should push out the following repeated sections to be a separate component, and pass props to it.
        <div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              required
              value={posting.title}
              onChange={handleInputChange}
              name="title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="authors">Authors' Initials</label>
            <input
              type="text"
              className="form-control"
              id="authors"
              required
              value={posting.authors}
              onChange={handleInputChange}
              name="authors"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              required
              value={posting.description}
              onChange={handleInputChange}
              name="description"
            />
          </div>

          <button onClick={savePosting} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPosting;