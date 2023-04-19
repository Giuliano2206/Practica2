import { useState, useContext, useEffect } from "react";
import { AppointmentContext } from "../../../context/appointment/AppointmentContext";
import { Form, Input, Button, Select, Icon, Popup, Radio, Message } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as constClass from "../../../api/Api";
import AppointmentServiceFormSize from "./AppointmentServiceFormSize"
import AppointmentServiceFormDirtness from "./AppointmentServiceFormDirtness";
import AppointmentServiceFormRooms from "./AppointmentServiceFormRooms";
import AppointmentPropertyTypeSelector from "./PropertyTypeSelector";
import AppointmentServiceFormCommuneProperty from "./AppointmentServiceFormCommuneProperty";

function AppointmentServiceForm(props) {
  const navigate = useNavigate();

  const { route, service } = useOutletContext();

  // general-cleaning-service

  const { updateDetails, updatePrice, updateAllPrices, updateDuration, getDetail, checkDetails, checkDetails2, updateUnitPrice, updatePropertyType, state, updateAppointmentQuantity, checkDetails1stStep, getCommune } =
    useContext(AppointmentContext);
  const { REACT_APP_PRICING_CALCULATOR_API_KEY } = process.env;

  const [maxTimeError, setMaxTimeError] = useState("");

  const calcPrices = checkDetails2();

  useEffect(() => {
    sessionStorage.setItem("pop_return_status", "true");
  }, [])

  async function getWorkInfo(url = "", data = {}) {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": REACT_APP_PRICING_CALCULATOR_API_KEY,
      },
      body: JSON.stringify(data),
    });
    let json = await response.json();
    return json;
  }


  const maxQuantity = [1, 2, 3, 4, 5];
  const [quantity, setQuantity] = useState(state.appointmentQuantity);
  const [details, setDetails] = useState({});
  const [loadedData, setLoadedData] = useState(false);
  
  const formValid = !checkDetails1stStep() || (quantity < 1) || !loadedData;


  useEffect(async () => {
    if (calcPrices){
      setLoadedData(false);
      await loadPrices();
      setLoadedData(true);
    }
  }, [details])

  const updateDetailsClick = () => {
    const body = {
      bedrooms: getDetail("rooms"),
      bathrooms: getDetail("bathrooms"),
      size: getDetail("size"),
      dirtiness: getDetail("dirtiness"),
      property_type: getDetail("propertyType"),
      commune: getCommune()
    };
    setDetails(body);
  }

  const onSubmit = (e) => {
    navigate(route.path_next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const loadPrices = async () => {
    // change this body to generalize
    const body = {
      bedrooms: getDetail("rooms"),
      bathrooms: getDetail("bathrooms"),
      size: getDetail("size"),
      dirtiness: getDetail("dirtiness"),
      property_type: getDetail("propertyType"),
      commune: getCommune()
    };
    await getWorkInfo(constClass.pricingCalculatorAPI, body).then((data) => {
      if (data.statusCode === 200) {
        updateUnitPrice(data.body.values.price);
        updatePrice(data.body.values.price);
        updateAllPrices(JSON.parse(data.body.values.allPrices));
        updateDuration(data.body.values.durationMinutes);
      } else {
        setMaxTimeError(data.body.userMessage);
      }
    });
  };

  const onQuantityChange = (value) => {
    setQuantity(value);
    updateAppointmentQuantity(value);
    updatePrice(state.allPrices[value-1]);
  }

  

  const showOptions = () => {
    return maxQuantity.map((index) => {
      let c = quantity === index ? "c__2" : "c__1";
      return(
              <div className={'appointment-frequency-box ' + c}>
                <Radio
                  className='appointment-frequency-text'
                  label={"FRECUENCIA " + index}
                  name='radioGroup'
                  value={index}
                  checked={quantity === index}
                  onChange={(e) => onQuantityChange(index)}
                />
                <div className="appointment-frequency-down-text">
                  <div className="appointment-frequency-down-text__text">
                    Recibe {index} servicio/s de limpieza 
                  </div>

                  <div className="appointment-frequency-down-text__price">
                    {new Intl.NumberFormat('es-CL').format(state.allPrices[index-1])} CLP

                  </div>
                </div>
              </div>
          );
    })
  }

  const renderFrequency = () => {
    if (loadedData) {
      return (
        <div className="appointment-frequency-container"> 
          <div className="appointment-frequency-title">
            ¿Con qué frecuencia?
          </div>
          {showOptions()}

        </div>
      )
    }
  }
  

  const infoServices = require("../../../data/services.json").services;
  const infoServiceForm = infoServices[service].form;

  const renderServiceForm2 = () => {{
    return (
      <div className="appointment-form-container" >
        <AppointmentServiceFormCommuneProperty 
          onClickChanger={() => updateDetailsClick()}
        />
        <AppointmentServiceFormSize 
          onClickChanger={() => updateDetailsClick()}
          info={infoServiceForm[2]}
          updateDetails = {updateDetails}
        />
        <AppointmentServiceFormRooms
          onClickChanger={() => updateDetailsClick()}
          info={infoServiceForm[0]}
          updateDetails = {updateDetails}
          />
        <AppointmentServiceFormRooms
          onClickChanger={() => updateDetailsClick()}
          info={infoServiceForm[1]}
          updateDetails = {updateDetails}
        />
        <AppointmentServiceFormDirtness
          onClickChanger={() => updateDetailsClick()}
          info={infoServiceForm[3]}
          updateDetails = {updateDetails}
        />
      </div>
    )
  }}

  return (
    <div className="appointment-form-container-main">
      <div className="appointment-form-title-container">
        <div className="appointment-form-title">
          ¡Personaliza tu servicio!
        </div>
        <div className="appointment-form-title-text">
          ¡Recuerda que debes tener los utensilios de limpieza necesarios en el lugar para que podamos realizar el servicio!
        </div>
      </div>
      
      {renderServiceForm2()}
      {renderFrequency()}

      <div className="appointment-button-container2">
        <button className="appointment-button__prev"  onClick={() => navigate(route.path_prev)} basic>
          Volver
        </button>
        <button className={!formValid ? "appointment-button__next" : "appointment-button__disabled"} disabled={formValid}  onClick={onSubmit} primary>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default AppointmentServiceForm;
