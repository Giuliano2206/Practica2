import { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Grid, Icon, Popup } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";

function AppointmentAddSubstract(props) {
    // hay que crear un state para guardar la cantidad de horas
    // y luego actulizar bien los datos.
    const optionLength = props.obj.options.length;
    const [count, setCount] = useState(0);

    const [price, setPrice] = useState(0);
    const [marks, setMarks] = useState(new Array(props.obj.options.length - 1).fill(false));

    useEffect(()=> {
        props.appointment.updateOptionalDetails({ [props.obj.id]:'0' })
      }, []);

    const getKey = (value, obj) => {
        for (let i in obj.options) {
          if (obj.options[i].value === value) {
            return obj.options[i].key
          }
        }
        return ""
      }
    
    //Resetea los botones dependiendo de que se escoge
    const clickHandler = (mode) => {
        let nextCount;
        if (mode === "-") {
            nextCount = count - 1;
            if (nextCount < 0){
                nextCount = 0;
            }
            
        }
        else if (mode === "+"){
            nextCount = count + 1;
            if (nextCount > optionLength-1){
                nextCount = optionLength-1;
            }
        }

        setCount(nextCount);
        // Price handler
        let value = props.obj.options[nextCount].value;
        setPrice(value);  
        props.onChangeServices(props.obj, value);
        let v = getKey(value, props.obj);
        props.appointment.updateDetails({ [props.obj.id + "_value"]: value });
        props.appointment.updateOptionalDetails({ [props.obj.id]: v })
      
    }
    

    const createAddSubstract = () => {
        return (
            <div className="appointment-room-container">
                <div className="appointment-room-buttons-container">
                    <button 
                        className="appointment-room-button"
                        onClick={() => clickHandler("-")}
                    >
                        -
                    </button>

                    <div className="appointment-room-count">
                        {props.obj.options[count].text}
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
    return (
            <div className="appointment-opt-serv-addSubstract-container">
                <div className="appointment-opt-serv-addSubstract-top">
                    <div className="appointment-opt-serv-title1">
                        <button
                            className={count>0 ? "appointment-opt-serv-circle-button__active" : "appointment-opt-serv-circle-button"}
                        >
                            {count>0 && <Icon name='check' size='large' />}
                        </button>
                        <div className="appointment-opt-serv-title1__title">{props.obj.title}</div>
                    </div>
                    <div className="appointment-opt-serv-price-container desktop2">
                        <div className="appointment-opt-serv-price desktop">
                            {new Intl.NumberFormat('es-CL').format(props.obj.options[count].value )+ " CLP"}
                        </div>
                        <div className="appointment-opt-serv-info">
                        <Popup
                            trigger={<Icon name='question circle outline'  color='blue' size='big' />}
                            wide='very'
                            content={props.obj.restrictions}
                            position='bottom center'
                        />
                        </div>
                    </div>
                </div>
                <div className="appointment-opt-serv-addSubstract-bottom">
                    <div className="appointment-opt-serv-addSubstract-text">
                        Selecciona la cantidad de horas
                    </div>
                    <div className="appointment-opt-serv-addSubstract-container-btn">
                        {createAddSubstract()}
                        <div className="appointment-opt-serv-price mobile">
                            {new Intl.NumberFormat('es-CL').format(props.obj.options[count].value )+ " CLP"}
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default AppointmentAddSubstract;