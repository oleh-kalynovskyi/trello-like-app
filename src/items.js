import React, {useState} from 'react';
import moment from 'moment';

                {/* <Items items={el} delateSub={delateSub}/> */}


export default function Items({ items, delateSub }) {

    const nowDate = new Date()

    const [board, setBoard] = useState(null)
    const [item, setItem] = useState(null)

    const [list, setList] = useState(items)
    console.log(items);

    const DragOver = (e) => {
        // e.preventDefault()
        if(e.target.className === 'Items') {
            e.target.style.boxShadow = '0 4px 3px gray'
        }
    }
    const DragLeave = (e, el) => {
        e.target.style.boxShadow = 'none'
    }
    const DragStart = (e, el, items) => {
        setBoard(items)
        setItem(el)
    }
    const DragEnd = (e, el) => {
        e.target.style.boxShadow = 'none'
    }
    const Drop = ( el, items ) => {
        // e.preventDefault()
        const currIndex = board && board.results.indexOf(item)
        board && board.results.splice(currIndex, 1)
        const dropIdex = items.results.indexOf(item)
        items.results.splice(dropIdex + 1, 0, item) 

        // setList( list.map(b => {
        //     if ( b.id === items.id) {
        //         return list
        //     }
        //     if ( b.id === board.id) {
        //         return board
        //     }
        // }) )
    }

    return ( 
        <div className='Items-wrapper'>
            {
                list && list.map( (el, i) => {
                    return(
                        <div className="Items" 
                            key={i}
                            onDragOver={ (e) => DragOver(e, el) }
                            onDragLeave={ (e) => DragLeave(e) }
                            onDragStart={ (e) => DragStart(e, el, list) }
                            onDragEnd={ (e) => DragEnd(e) }
                            onDrop={ Drop( el, list) }
                            draggable={true}
                            >

                            <div className="Items-title">
                                { el.subTitle}
                            </div>
                            <div className="Items-date">
                                {moment(el.postDate).from(moment(nowDate)._d)}  
                            </div>


                            <button onClick={ ()=> delateSub(el, items.title) }> X </button>

                        </div>
                    )
                })
            }
        </div>
    )
}
