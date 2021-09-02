import React, {useEffect, useState} from "react";
// import Items from './items';
import './style.css';
import moment from 'moment';


const API_URL = 'https://morning-anchorage-87811.herokuapp.com'

function App() {

  useEffect( () => {
    fetch(`${API_URL}/api`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data ); 
    })
  }, [])

  const [DashboardName, setDashboardName] = useState([])
  const [ItemValue, setItemValue] = useState('')

  const [servRes, setServRes] = useState([])

  const [Alert, setAlert] = useState(false)


  const hendlerSubmit = (e) => {
    e.preventDefault()    
    e.target.reset();
    
    const curItem = DashboardName;
    const arr = servRes;
    const index = arr.findIndex(el => el.title === curItem.title); 
    index === -1 
    ?
    fetch(`${API_URL}/api`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(DashboardName) 
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data );
    })
    :
    setAlert( true );
  }

  const itemSubmit = (e) => {
    e.preventDefault()
    e.target.reset();

    fetch(`${API_URL}/api/sub`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(ItemValue)
     })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data );
    })
  }

  const Delate = (el) => {
    fetch(`${API_URL}/api/` + el.id, {
      method: 'delete'
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data );
    })
  }

  const delateSub = (el, board) => {
    //('http://localhost:5000/api/sub/' + items + '/' + el.subTitle,
    fetch(`${API_URL}/api/sub/` + board.title + '/' + el.subTitle, {
      method: 'delete'
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data );
    })
  }

  const closeModal = () => {
    setAlert( false );
  }

const nowDate = new Date()

const [currBoard, setCurrBoard] = useState(null)
const [currItem, setCurrItem] = useState(null)

function DragOver(e){
    e.preventDefault();
    if(e.target.className === 'Items') {
        e.target.style.boxShadow = '0 4px 3px gray'
    }
}
function DragLeave(e) {
    e.target.style.boxShadow = 'none'
}
function DragStart(e, item, board) {
  setCurrBoard(board)
  setCurrItem(item)
}
function DragEnd(e) {
    e.target.style.boxShadow = 'none'
}
function Drop(item, board ) {
    const currIndex = currBoard && currBoard.results.indexOf(currItem)
    currBoard && currBoard.results.splice(currIndex, 1)
    const dropIdex = board && board.results.indexOf(item)
    board && board.results.splice(dropIdex + 1, 0, currItem) 

    setServRes( servRes.map(b => {
        if( b.id === board && board.id) {
          return board
        }
        if( b.id === currBoard && currBoard.id) {
          return currBoard
        }
        return b
    }) )

    fetch(`${API_URL}/api`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(servRes) 
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setServRes( data );
    })
}

  return (
    <div className="App">
      <header className='header'>
        <h1>Trello Dashboard</h1>
        <form onSubmit={(e)=> hendlerSubmit(e) }>
          <label htmlFor="Dashboard-input">Create name:</label>
          <input 
            id='Dashboard-input'
            placeholder="Dashboard name"
            required
            autoComplete='off'
            type="text"
            name="Dashboard" 
            onChange={(e)=> setDashboardName({'id': Math.random(), 'title': e.target.value, 'results':[] }) }
          />
          <button className='btn'>Create Dashboard</button>
        </form>
      </header>

    {Alert 
    ?
    <div className="modal">
      Dashboard with this Name exists - enter other Name 
      <button className='btn' onClick={ closeModal }>X</button>
    </div>
    :
    null
    }

    <div className="dashboard-wrapper">
    {servRes.length < 1
      ?
      <div className="Create-a-dashboard">
        <div className="isFetching"></div>
        <h3>dashboard list is empty</h3>
      </div>
      :
      <div className="dashboard-list">
        { servRes && servRes.map((board, i) => {
          return(
            <div className="dashboard-item" key={i}>

              <div className="dashboard-item-head">
                <h3 className="dashboard-item-head-title">
                  {board.title} 
                </h3>
                <button 
                  className='remove-btn'
                  onClick={ () => Delate(board) }>X</button>
              </div>

              <form onSubmit={(e)=> itemSubmit(e) }>
                <label htmlFor="dashboard-item-input">Item Value name:</label>
                <input 
                  id='dashboard-item-input'
                  placeholder="Task"
                  required
                  autoComplete='off'
                  type="text"
                  onChange={(e)=> setItemValue( {'subTitle':e.target.value, 'board':board.title, 'postDate' : moment()._d} ) }
                />
                <button className='btn'>Add task</button>
              </form>
                {
                board && board.results.map( (item, i) => {
                  return(
                    <div className="Items" 
                      key={i}
                      onDragOver={ (e) => DragOver(e, item) }
                      onDragLeave={ (e) => DragLeave(e) }
                      onDragStart={ (e) => DragStart(e, item, board) }
                      onDragEnd={ (e) => DragEnd(e) }
                      onDrop={ () => Drop( item, board) }
                      draggable={true}
                      >

                      <div className="Items-title">
                          { item && item.subTitle}
                      </div>

                      <div className="Items-botton">
                        <div className="Items-date">
                            { moment( item.postDate && item.postDate).from(moment(nowDate)._d) }   
                        </div>

                        <button 
                          className='remove-btn'
                          onClick={ ()=> delateSub(item, board) }> X </button>
                      </div>

                    </div>
                  )
                })
              }
            </div>
          )
        })}
      </div>

    }
    </div>

    </div>
  );
}

export default App;

