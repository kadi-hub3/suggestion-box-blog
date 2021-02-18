import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'


const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [editing, setEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name && name.length > 10) {
      //display alert
      showAlert(true, 'Please enter your suggestion', 'danger')
    } else if (name && editing) {
      //edit
      setList(list.map(item => {
        if (item.id === editID) {
          return { ...item, title: name }
        }
        return item
      }))
      setName('')
      setEditID(null)
      setEditing(false)
      showAlert(true, 'Suggestion modified', 'success')


    } else {
      //alert &new item
      showAlert(true, 'Suggestion added to our improvement list', 'success')
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, type, msg })
    setTimeout(() => {

    }, 3000);

  }

  const clearList = () => {
    showAlert(true, 'Suggestions deleted', 'danger')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'Suggestion Removed', 'danger')
    setList(list.filter((item) => item.id !== id))
  }

  const ediItem = (id) => {
    const specific = list.find(item => item.id === id)
    setEditing(true)
    setEditID(id)
    setName(specific.title)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>Suggestion Box</h3>
      <div className='form-control'>
        <input type='text' minLength="10" maxLength="200" className='grocery' placeholder='e.g eggs' value={name} onChange={(e) => setName(e.target.value)} />
        <button type='submit' className='submit-btm'>
          {editing ? 'edit' : 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 && (
      <div className='grocery-container'>
        <List items={list} removeItem={removeItem} editItem={ediItem} />
        <button className='clear-btn' onClick={clearList}>
          Clear items
        </button>
      </div>
    )}

  </section>
}

export default App
