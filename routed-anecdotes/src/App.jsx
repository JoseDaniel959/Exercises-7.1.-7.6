import {
  BrowserRouter as Router,
  Routes, Route, Link,useParams,
  useNavigate
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useField } from './hooks'
const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/anecdotes">anecdotes</Link>
      <Link style={padding} to="/create">create</Link>
      <Link style={padding} to="/about">about</Link>


      {/* <a href='#' style={padding}>anecdotes</a>
      <a href='#' style={padding}>create new</a>
      <a href='#' style={padding}>about</a> */}
    </div>
  )
}

const AnecdoteList = ({ anecdotes,newAnecdote }) => (
  <div>
    <h2>Anecdotes</h2>
    {newAnecdote &&(
      <p>{newAnecdote}</p>
    )}
    <ul>
      {anecdotes.map(anecdote => 
      
      <li key={anecdote.id} >
      <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
      </li>)}
    </ul>
  </div>
)

const Anecdote = ({anecdotes}) =>{
  const id = useParams().id
  const anecdote = anecdotes.find(anecdote => anecdote.id === Number(id))
  console.log(id)
  return(
    <div>
      <div><strong>{anecdote.content} by {anecdote.author}</strong></div>
      <div>{anecdote.votes}</div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  
  // const [content, setContent] = useState('')
  // const [author, setAuthor] = useState('')
  // const [info, setInfo] = useState('')
  const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(content.value)
    props.addNew({
      content:content.value,
      author:author.value,
      info:info.value,
      votes: 0
    })
    props.notification(`aneanecdote ${content.value} created!`)
    navigate("/anecdotes")
  }

  const resetButton = ()=> {
    content.resetField('')
    author.resetField('')
    info.resetField('')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' type={content.type} value={content.value} onChange={content.onChange} />
        </div>
        <div>
          author
          <input name='author' type={author.type} value={author.value} onChange={author.onChange} />
        </div>
        <div>
          url for more info
          <input name='info' type={info.type} value={info.value} onChange={info.onChange} />
        </div>
        <button>create</button>
        <button type='button' onClick={resetButton}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
  const [notification, setNotification] = useState('')
  
  useEffect( ()=>{
    setTimeout(()=>setNotification(''),3000)
  },
    [notification]
  )

 

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Router>
        <Menu />
        {/* <AnecdoteList anecdotes={anecdotes} />
        <About />
        <CreateNew addNew={addNew} /> */}
        
        <Routes>
          <Route path="/anecdotes" element={ <AnecdoteList anecdotes={anecdotes} newAnecdote={notification} />} />
          <Route path="/anecdotes/:id" element={ <Anecdote anecdotes={anecdotes} />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreateNew addNew={addNew} notification={setNotification}/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
