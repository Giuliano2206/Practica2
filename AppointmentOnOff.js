import { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Checkbox, Icon, Popup } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";

function AppointmentOnOff(props) {
    const [state, setState] = useState(false);
    const [price, setPrice] = useState(0);

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
    const checkBlock = (key) => {
      let bloqueantes = ["limpiezaMicroondas", "limpiezaRefrigerador", "limpiezaHorno"];
      for (let i = 0; i < bloqueantes.length; i++) {
        if (bloqueantes[i] == key) {
          return true
        }
      }
      return false
    }
    
    const reviewOthers = (mode) => {
      let servs = props.appointment.state.details.optionalDetails || {};
      if (mode === 1) {
        for (let key in servs){
          if (servs[key] !== "0" && checkBlock(key)){
            return false
          }
        }
        return true
      }
      else if (mode === 2) {
        let valorCombo = servs["limpiezaHornoRefriMicroondas"] || "0";
        if (valorCombo !== "0")
        return false
      }
      return true
    }

    const clickHandler = () => { 
      // caso de pack de servicios
      if (props.obj.id === "limpiezaHornoRefriMicroondas" && !reviewOthers(1)){
        
      }
      else if (props.obj.id !== "limpiezaHornoRefriMicroondas" && !reviewOthers(2)) {
        
      }
      else{
        let value = !state ? props.obj.options[1].value : props.obj.options[0].value;
        setPrice(value);  
        props.onChangeServices(props.obj, value);
        let v = getKey(value, props.obj);
        props.appointment.updateDetails({ [props.obj.id + "_value"]: value });
        props.appointment.updateOptionalDetails({ [props.obj.id]: v })
        
        setState((prevState) => (!prevState))
      }
      
    }

    return (
      <div className="appointment-opt-serv-row1"> 
        <div className="appointment-opt-serv-title1">
          <button
              className={state ? "appointment-opt-serv-circle-button__active" : "appointment-opt-serv-circle-button__unactive"}
              active={state}
              color={state ? 'blue' : null}
              onClick={() => {
                clickHandler();
              }}
          >
            {state && <Icon name='check' size='large' />}
          </button>
          <div className="appointment-opt-serv-title1__title">
            {props.obj.title}
          </div>
        </div>
        <div className="appointment-opt-serv-price-container">
          <div className="appointment-opt-serv-price">
            {new Intl.NumberFormat('es-CL').format(props.obj.options[1].value )+ " CLP"}
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

    )
}
export default AppointmentOnOff;