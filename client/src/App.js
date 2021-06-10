import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import './App.css';

function App() {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ffee9b');
    const [label, setLabel] = useState('SAVE');
    const [notes, setNotes] = useState([]);
    const [flag, setFlag] = useState(false);
    const [alert, setAlert] = useState(false);
    const [xid, setXid] = useState('');

    useEffect(() => {
        Axios.get('http://localhost:3001/api/read')
        .then((response) => {
            setNotes(response.data.records);
        });
    }, [flag]);

    const submitForm = () => {
        if (id) {
            Axios.put('http://localhost:3001/api/update', {id: id, title: title, description: description, color: color})
            .then((response) => {
                console.log(response.data);
                clearForm();
                setFlag(!flag);
            });
        } else {
            Axios.post('http://localhost:3001/api/create', {title: title, description: description, color: color})
            .then((response) => {
                console.log(response.data);
                clearForm();
                setFlag(!flag);
            });
        }
    };

    const updateForm = (_note) => {
        setId(_note.id);
        setTitle(_note.title);
        setDescription(_note.description);
        setColor(_note.color);
        setLabel('UPDATE');
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const deleteForm = (_id) => {
        setAlert(false);
        Axios.delete('http://localhost:3001/api/delete/'+_id+'/0')
        .then((response) => {
            console.log(response.data);
            clearForm();
            setFlag(!flag);
            setXid(_id);
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
                setXid('');
            }, 3000);
        });
    };

    const undoDelete = () => {
        setAlert(false);
        Axios.delete('http://localhost:3001/api/delete/'+xid+'/1')
        .then((response) => {
            console.log(response.data);
            clearForm();
            setFlag(!flag);
            setXid('');
        });
    };

    const clearForm = () => {
        setId('');
        setTitle('');
        setDescription('');
        setColor('#ffee9b');
        setLabel('SAVE');
    };

    return (
        <div className="App">
            <div className="wrapper" id="form">
                <input type="text" name="title" placeholder="Title" autoComplete="off" value={title!=='' ? title : ''} onChange={(e) => { setTitle(e.target.value) }} />
                <textarea name="description" placeholder="Write somethign here...." autoComplete="off" value={description!=='' ? description : ''} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                <div style={{marginBottom: "20px"}}>
                    <span>
                        <input type="radio" name="color" value="#ffee9b" onChange={(e) => { setColor(e.target.value) }} checked={color==='#ffee9b' || color==='' ? true : false} />
                        <input type="radio" name="color" value="#b2d4f5" onChange={(e) => { setColor(e.target.value) }} checked={color==='#b2d4f5' ? true : false} />
                        <input type="radio" name="color" value="#fcc3a7" onChange={(e) => { setColor(e.target.value) }} checked={color==='#fcc3a7' ? true : false} />
                        <input type="radio" name="color" value="#8fd1bb" onChange={(e) => { setColor(e.target.value) }} checked={color==='#8fd1bb' ? true : false} />
                        <input type="radio" name="color" value="#d5dadc" onChange={(e) => { setColor(e.target.value) }} checked={color==='#d5dadc' ? true : false} />
                    </span>
                    <span>
                        <button style={{color: "rgba(0, 0, 0, 0.5)"}} onClick={clearForm}>CLEAR</button>
                        <button className="submit" onClick={submitForm}>{label}</button>
                    </span>
                </div>
            </div>
            {notes.map((data) => {
                return (
                    <div className="wrapper" style={{backgroundColor: data.color}} key={data.id}>
                        <p className="title">{data.title}</p>
                        <p className="description">{data.description}</p>
                        <div>
                            <small>{data.updated_at.replace(/T|.{5}$/g,' ')}</small>
                            <span>
                                <button onClick={() => updateForm(data)}>EDIT</button>
                                <button style={{color: "#ff0000"}} onClick={() => deleteForm(data.id)}>DELETE</button>
                            </span>
                        </div>
                    </div>
                );
            })}
            <div id="alert" style={alert ? {} : {display: 'none'}}>
                <span>Undo delete</span>
                <button onClick={undoDelete}>UNDO</button>
            </div>
        </div>
    );
}

export default App;
