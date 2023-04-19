import React, { useContext, useState, useEffect } from 'react'
import { Form, Select, Button, Input,Message, Grid , Icon, Popup} from 'semantic-ui-react'

const AppointmentPropertyTypeSelector = ({ mode, updatePropertyType, onClickChanger, state }) => {
    const propertyTypes = ["CASA", "DEPARTAMENTO"];
    const [marks, setMarks] = useState(new Array(propertyTypes.length).fill(false));

    
    const correctName = (property) => {
        switch (property) {
            case "CASA":
                return "house";
            case "DEPARTAMENTO":
                return "apartment";
            default:
                return "";
        }
        
    }
    useEffect(()=> {
        let auxArray = new Array(propertyTypes.length).fill(false);
        for (let i=0; i<propertyTypes.length; i++){
            let posibleType = "propertyType" in state.details ? state.details.propertyType : "";
            if(correctName(propertyTypes[i]) === posibleType){
                auxArray[i] = true;
            }
        }
        setMarks(auxArray);
    }, [])

    const clickHandler = (index) => {
        let auxArray = new Array(propertyTypes.length).fill(false);
        auxArray[index] = true;
        setMarks(auxArray);
        updatePropertyType({propertyType: correctName(propertyTypes[index])});
        onClickChanger();
    }

    const createButtons = () => {
        return propertyTypes.map((obj, index) => {
            let width = index===0 ? "measure__1" : "measure__2";
            return (
                <button
                    className={marks[index] ? 'appointment-property-button__active ' + width : 'appointment-property-button__unactive ' + width}
                    onClick={() => clickHandler(index)}
                >{obj}</button>
            )
        })
    }
    let display = mode==="mobile" ? "mobile" : "desktop";
    return (
        <div className={'appointment-property-container ' + display}>
            {createButtons()}
        </div>
    )
}

export default AppointmentPropertyTypeSelector;