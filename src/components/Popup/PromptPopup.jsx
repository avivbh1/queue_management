
import Popup from "./Popup";

export default function PromptPopup(message, closeCallback, popupTextboxRef, makeChangesCallback){ 
    return <Popup closeCallback={closeCallback}>
    <h1 id='popup-text-message' className='light-weight'>{message}</h1>
    <br></br>
    <br></br>
    <input ref={popupTextboxRef} type="text" className='popup-textbox'></input>
    <br></br>
    <br></br>
    <button  className='popup-confirm-btn' onClick={makeChangesCallback}>Confirm</button>   
    </Popup>
}
