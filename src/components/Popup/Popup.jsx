import React from "react";
import "./Popup.css"

export default function Popup(props){
    // props params:
    // closeCallback (close popup callback function)

    return (
        <div className='popup'>
            <button className="close-btn" onClick={props.closeCallback}>x</button>
            <div id="popup-logo">
            </div>
            <div className="popup-inner">
                <br></br>
                {props.children}
            </div>
        </div>
    )
}