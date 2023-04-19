import React, { useContext, useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'

let propertyTypeData = require("../../data/propertyTypes.json")

const AppointmentPropertyTypeSelector = ({ updatePropertyType }) => {
    const propertyTypes = propertyTypeData.propertyTypes;
    const propertyValues = propertyTypeData.propertyValues;

    const [marks, setMarks] = useState(new Array(propertyTypes.length).fill(false));
    
    const clickHandler = (index) => {
        let auxArray = new Array(propertyTypes.length).fill(false);
        auxArray[index] = true;
        setMarks(auxArray);
        updatePropertyType({propertyType: propertyValues[index]});
    }

    const createButtons = () => {
        return propertyTypes.map((obj, index) => {
            return (
                <Button
                    basic={marks[index] ? false : true}
                    active={marks[index]} 
                    color={marks[index] ? 'blue' : 'grey'}
                    onClick={() => clickHandler(index)}
                >{obj}</Button>
            )
        })
    }

    return (
        <>
            {createButtons()}
        </>
    )
}

export default AppointmentPropertyTypeSelector;