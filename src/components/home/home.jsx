import "./home.css"
import {API_URL} from "../../utils.js"
import io from 'socket.io-client';
import React, {useState, useEffect } from 'react';
import axios from 'axios';

const socket = io.connect(API_URL);
const MAX_OUTSIDE = 4;
export default function Home() {

    const [queue, setQueue] = useState([]);
    socket.on('connect', () => {
        console.log("connected to socket")
    });

    socket.on('client-entered', newQueue => {
        setQueue(newQueue);
    });

    socket.on('client-left', newQueue => {
        setQueue(newQueue);
    });

    const initializeName = () => {
        console.log("hereee : " + localStorage.getItem("name"));
        if (null === localStorage.getItem("name")) {
            const myPromise = new Promise((resolve, reject) => {
                let name = "";

                while ("" === name) {
                    name = prompt("הרשם: הכנס את השם המלא שלך");

                    if ("" === name) {
                        alert("השם שהוזן אינו תקין, הרשם שוב")
                    }
                }
                resolve(name);
            })
            myPromise
            .then(data => {
                localStorage.setItem("name", data);
            })
        }
    };

    const initializeQueue = () => {
        axios.get(`${API_URL}api/queue`, {method: 'GET'})
        .then(response => {

            if (response.status === 200) {
                setQueue(response.data);
            } else {
                throw new Error("Something went wrong.");
            }
        }).catch(err => {
            console.log(err);
        })
    };
    const enterQueue = () => {
        let currentName = localStorage.getItem("name")

        if (null == currentName || "" === currentName) {
            const myPromise = new Promise((resolve, reject) => {
                let name = "";

                while ("" === name) {
                    name = prompt("הרשם: הכנס את השם המלא שלך");
                    if ("" === name) {
                        alert("השם שהוזן אינו תקין, הרשם שוב")
                    }
                }
                resolve(name);
            })
            myPromise
            .then(data => {
                localStorage.setItem("name", data);

            })
        }
        // Getting the name after the changes
        currentName = localStorage.getItem("name")
        if(!queue.includes(currentName)) {
            socket.emit("client-entered", currentName);
        } else {
            alert("אתה כבר נמצא בתור.")
        }
    };

    const leaveQueue = () => {
        let currentName = localStorage.getItem("name");

        if (null == currentName) {
            const myPromise = new Promise((resolve, reject) => {
                let name = "";
                while ("" === name) {
                    name = prompt("הרשם: הכנס את השם המלא שלך");
                    if ("" === name) {
                        alert("השם שהוזן אינו תקין, הרשם שוב")
                    }
                }
                resolve(name);
            })
            myPromise
            .then(data => {
                localStorage.setItem("name", data);

            })
        }
        // Getting the name after the changes
        currentName = localStorage.getItem("name")
        if(queue.includes(currentName)) {
            socket.emit("client-left", currentName);
        } else {
            alert("אתה לא בתור, בבקשה אל תספים אותנו")
        }
    }
    
    useEffect(() => {
        initializeQueue();
        initializeName();
    }, [])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault();
          event.returnValue = ''; // Needed for some browsers
        };
    
        const handleUnload = () => {
          io.emit("client-left", localStorage.getItem("name"))
          socket.close();
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          window.removeEventListener('unload', handleUnload);
        };
      }, []);

    return (
        <div id='home'>
            <header>
            <h1 id='title'>?מי בחוץ</h1>
            </header>
                <h1 class='message'>{queue.slice(0, MAX_OUTSIDE).includes(localStorage.getItem("name")) ? "אתה יכול לצאת": null}</h1>
            <div class='content-box'>
                <ul>
                <h2>מחוץ לכיתה</h2> 
                {queue.slice(0,MAX_OUTSIDE).map((item, index) => {
                            return <div class='list-item'>
                            <span class="index">{index+1}.</span>
                            <li class='list-item' key={index}>{item}</li>
                          </div>
                    })}
                </ul>
                <ul>
                <h2>?מי בתור</h2> 
                {queue.slice(MAX_OUTSIDE).map((item, index) => {
                            return <div class='list-item'>
                            <span class="index">{MAX_OUTSIDE + index+1}.</span>
                            <li class='list-item' key={index}>{item}</li>
                          </div>
                    })}
                </ul>
            </div>
            <div class='button-container'>
                <button id='enter-button' class='button' onClick={enterQueue}>כניסה לתור</button>
                <button id='leave-button' class='button' onClick={leaveQueue}>יציאה מהתור</button>
            </div>
        </div>
    );
}

