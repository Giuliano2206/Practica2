import { useState, useContext, useEffect } from "react";

const AppointmentServiceFormRooms = ({ info, updateDetails, onClickChanger }) => {
    const [rooms, setRooms] = useState(0);
    
    const clickHandler = (mode) => {
        if (mode === "-") {
            setRooms((prevState) => {
                if (prevState-1 < info.min) {
                    updateDetails({ [info.id]: info.min});
                    return info.min
                }
                else{
                    updateDetails({ [info.id]: prevState-1});
                    return prevState-1;
                }
            })
        }
        else if (mode === "+"){
            setRooms((prevState) => {
                if (prevState + 1 > info.max) {
                    updateDetails({ [info.id]: info.max});
                    return info.max;
                }
                else {
                    updateDetails({ [info.id]: prevState + 1});
                    return prevState + 1;
                }
            })
        }
        onClickChanger();
    }


    return (
        <div className="appointment-room-container">
            <div className="appointment-title-option">{info.text}</div>
            <div className="appointment-room-buttons-container">
                <button 
                    className="appointment-room-button"
                    onClick={() => clickHandler("-")}
                >
                    -
                </button>
                <div className="appointment-room-count">
                    {rooms}
                </div>
                <button 
                    className="appointment-room-button"
                    onClick={() => clickHandler("+")}
                >
                    +
                </button>

            </div>
        </div>
    )   
}
export default AppointmentServiceFormRooms;