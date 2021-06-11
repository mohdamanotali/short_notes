import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import './App.css';

function App() {
    const baseUrl = 'http://localhost:3001/api';
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ffee9b');
    const [label, setLabel] = useState('SAVE');
    const [notes, setNotes] = useState([]);
    const [flag, setFlag] = useState(false);
    const [undo, setUndo] = useState(false);
    const [xid, setXid] = useState('');
    const [alert, setAlert] = useState('');

    useEffect(() => {
        async function readData() {
            await Axios.get(baseUrl+'/read')
            .then((response) => {
                setNotes(response.data.records);
            });
        }
        readData();
    }, [flag]);

    const submitForm = async () => {
        const _params = {title: title, description: description, color: color};
        let _message = '';
        if (id) {
            await Axios.put(baseUrl+'/update/'+id, _params)
            .then((response) => {
                _message = (response.data.message !== undefined) ? response.data.message : _message;
            });
        } else {
            await Axios.post(baseUrl+'/create', _params)
            .then((response) => {
                _message = (response.data.message !== undefined) ? response.data.message : _message;
            });
        }
        if (_message !== '') {
            resetState();
            setAlert(_message);
            setFlag(!flag);
            setTimer(3);
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

    const deleteForm = async (_id) => {
        await Axios.delete(baseUrl+'/delete/'+_id, {data: {status: 0}})
        .then((response) => {
            if (response.data.message !== undefined && response.data.message) {
                resetState();
                setXid(_id);
                setUndo(true);
                setFlag(!flag);
                setTimer(5);
            }
        });
    };

    const undoDelete = async () => {
        if (xid) {
            await Axios.delete(baseUrl+'/delete/'+xid, {data: {status: 1}})
            .then((response) => {
                if (response.data.message !== undefined && response.data.message) {
                    resetState();
                    setAlert(response.data.message);
                    setFlag(!flag);
                    setTimer(3);
                }
            });
        }
    };

    const resetState = () => {
        setId('');
        setTitle('');
        setDescription('');
        setColor('#ffee9b');
        setLabel('SAVE');
        setUndo(false);
        setXid('');
        setAlert('');
    };

    const setTimer = (_seconds) => {
        setTimeout(() => {
            resetState();
        }, _seconds * 1000);
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
                        <button style={{color: "rgba(0, 0, 0, 0.5)"}} onClick={resetState}>CLEAR</button>
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
            <div className="alert" style={alert ? {} : {display: 'none'}}>
                <p>{alert}</p>
            </div>
            <div className="alert" style={undo ? {} : {display: 'none'}}>
                <span>Undo delete</span>
                <button onClick={undoDelete}>UNDO</button>
            </div>
        </div>
    );
}

export default App;
