import React, { useContext, useState, useEffect } from 'react'

const AppointmentServiceFormDirtness = ({ info, updateDetails, onClickChanger }) => {
    // const [dimentions ,setDimentions] = useState("");
    const [marks, setMarks] = useState(new Array(info.options.length).fill(false));
    const clickHandler = (index, value) => {
        let auxArray = new Array(info.options.length).fill(false);
        auxArray[index] = true;
        setMarks(auxArray);
        updateDetails({ [info.id]: value })
        onClickChanger();
    }

    const renderOptions = () => {
        return info.options.map((obj, index) => {
            if (index > 0){
                return (
                    <div>
                        <button 
                            className={marks[index] ? 'appointment-size-button__active' : 'appointment-size-button__disabled'}
                            onClick={() => clickHandler(index, obj.value)}
                        >
                            {obj.btn}
                        </button>
                    </div>
                )
            }
        })
    }
    return (
        <div className='appointment-room-container'>
            <div className='appointment-title-option'>NIVEL DE SUCIEDAD</div>
            <div className='appointment-dirtness-btn-container'>
                {renderOptions()}
            </div>
        </div>
    );
}
export default AppointmentServiceFormDirtness;