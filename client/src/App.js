import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios"

function App() {
  const [postList, setPostList] = useState([])

  // eslint-disable-next-line
  const [comment, setComment] = useState({
    text: 'test comment',
    post_id: 10
  })
  const [newPost, setNewPost] = useState({
    title: 'test title',
    contents: 'hello world'
  })
  const [editedPost, setEditedPost] = useState({
    title: 'edited title',
    contents: 'edited contents'
  })
  const [update, setUpdate] = useState(false)

  const [commentList, setCommentList] = useState([])

  const showComments = id => {
    const newList = commentList.map(ele => {
      if (id===ele.post_id) 
        return {...ele, isVisible: true}
      else return ele
    })
    setCommentList([...newList])
  }

  const findComments = id => {
    // console.log(id)
    
    // console.log(commentList.map(ele=>id===ele.post_id && ele))
    return commentList.find(ele=>id===ele.post_id)
  }
  
  

  useEffect(()=> {
    const comments = []
    axios
      .get('https://api-project-2.herokuapp.com/api/posts')
      .then(res=> {
        setPostList(res.data.post_list)
        return res.data.post_list
      })
      .then(res=> {
        res.map(post=> {
          axios.get(`https://api-project-2.herokuapp.com/api/posts/${post.id}/comments`)
            .then(res=> {
              console.log(res.data)
              comments.push(res.data.comment_list)
            })
            .catch(err=> console.log(err))
      })})
      .then(res=> {
        setCommentList(comments)
      })
      .catch(err=> console.log(err))
  }, [update])

  return (
    <div className="App" style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-start'
    }}>
      {!!postList && postList.map(post => {
        return (
          <>
          <div key={post.id} style={{
            border: '1px solid blue', 
            borderRadius: '4px', 
            padding: '20px', 
            marginBottom: '10px', 
            textAlign: 'left'
          }}>
            <p>ID: {post.id}</p>
            <p>Title: {post.title}</p>
            <p>Contents: {post.contents}</p>
            <p>Created on: {post.created_at}</p>
            <p>Last updated: {post.updated_at}</p>
            <div style={{
              borderRadius: '4px', 
              background: 'red', 
              padding: '10px', 
              marginBottom: '10px', 
              color: 'white', 
              cursor: 'pointer',
              textAlign: 'center'
            }} onClick={()=>{
              axios.delete(`https://api-project-2.herokuapp.com/api/posts/${post.id}`)
                .then(res=> {
                  setUpdate(!update)
                })
                .catch(err => console.log(err))
            }}>Delete post
            </div>
            <div style={{
              borderRadius: '4px', 
              background: 'lightblue', 
              padding: '10px', 
              marginBottom: '10px', 
              cursor: 'pointer',
              textAlign: 'center'
            }} onClick={()=>{
              axios.put(`https://api-project-2.herokuapp.com/api/posts/${post.id}`, editedPost)
              .then(res=> {
                setUpdate(!update)
              })
                .catch(err => console.log(err))
            }}>Edit post
            </div>
            {!!findComments(post.id) && 
            <>
            <div onClick = {()=> showComments(post.id)}>
              Show Comments
            </div>
            {!!findComments(post.id).isVisible && findComments(post.id).map(ele=> {
              return (
                <div style ={{border: '1px solid black', padding: '10px'}}>
                  <p>{comment.text}</p>
                </div>
              )
            })}
            </>
            }
            
            </div>
          </>
        )
      })}
      <div style={{
        borderRadius: '4px', 
        background: 'lightgreen', 
        padding: '10px', 
        marginBottom: '10px', 
        cursor: 'pointer',
        textAlign: 'center'
      }} onClick={()=> {
        axios.post(`https://api-project-2.herokuapp.com/api/posts`, newPost)
        .then(res=> {
          setUpdate(!update)
        })
          .catch(err=> console.log(err))
          
      }} > Add new test post
      </div>
    </div>
  );
}


export default App;
