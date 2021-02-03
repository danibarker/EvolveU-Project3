const updatePostOnDataArray = (setPostingsDataArray, postBuffer, currPostIndex) => {

  setPostingsDataArray((currDataArr) => {
    let newPostingsArr = [...currDataArr];
    newPostingsArr.splice(currPostIndex, 1, postBuffer);       // swap old post with postBuffer, by index
    console.log("updatePostingsDataArray.js- newPostingsArr =", newPostingsArr);
    return newPostingsArr;
  })
}

export default updatePostOnDataArray;
