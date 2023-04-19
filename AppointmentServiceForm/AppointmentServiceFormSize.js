import React, { useContext, useState, useEffect } from 'react'

const AppointmentServiceFormSize = ({ info, updateDetails, onClickChanger }) => {
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
                    <div className='appointment-size-row'>
                        <button 
                            className={marks[index] ? 'appointment-size-button__active' : 'appointment-size-button__disabled'}
                            onClick={() => clickHandler(index, obj.value)}
                        >
                                {obj.btn}
                        </button>
                        <div className='appointment-size-text'>{obj.text}</div>
                    </div>
                )
            }
        })
    }
    return (
        <div className='appointment-size-container'>
            <div className='appointment-title-option'>DIMENSIONES</div>
            {renderOptions()}
        </div>
    );
}
export default AppointmentServiceFormSize;