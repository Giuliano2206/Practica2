import React, { useEffect, useState } from "react";
import { Button, Loader, Popup, Icon } from "semantic-ui-react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import useCalendar from "../../hook/useCalendar";
import { useNavigate, useOutletContext } from "react-router-dom";
import { subDays } from 'date-fns';

import ModalCalendar from "./ModalCalendar.js";
import es from 'date-fns/locale/es';
registerLocale('es', es);


function OnePageCalendar({ appointment,
                            verifyDate2, 
                            addTimes,
                            getArrayBlocked,
                            addMinutes,
                            route,
                            filterPassedTime }) {
  const navigate = useNavigate();
  let today = new Date();
  const [blockedDay , setBlockedDay] = useState(false);

  const [isFirstDate , setIsFirstDate] = useState(false);

  const [messageInformation, setMessageInformation] = useState({
    initialDate: today,
    dateAvailable : today
  });

  const findFirstAvailableHour = () => {
    let auxDate = new Date();
    auxDate.setDate(auxDate.getDate()+1);
    auxDate.setMinutes(0, 0);
    let firstLoop = true;
    while (true) {
      if (filterPassedTime(auxDate) === true) {
        return auxDate;
      }
      auxDate = addMinutes(auxDate, 30); 
      firstLoop = false; 
    }
  }
  const findFirstAvailableHour2 = (fecha) => {
    let initialDate = fecha.getDate();
    let auxDate = new Date(fecha);
    auxDate.setHours(8);
    auxDate.setMinutes(0, 0);
    while (true) {
      if (filterPassedTime(auxDate) === true) {
        if (initialDate !== auxDate.getDate()) {
          setBlockedDay(true);
          setMessageInformation({
            initialDate: fecha,
            dateAvailable : auxDate 
          })
          return auxDate;
        }
        return auxDate;
      }
        auxDate = addMinutes(auxDate, 30);   
    }
  }

  let firstAvailableHour; 

  useEffect(() => {
    firstAvailableHour = findFirstAvailableHour()
  }, [])

  const [dates, setDates] = useState(new Array(appointment.state.appointmentQuantity).fill(firstAvailableHour));
  const [available, setAvailable] = useState(new Array(appointment.state.appointmentQuantity).fill(false));
  

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };


  async function changeHandler(fecha, index, type = 0) {
    if (type === 1) {
      fecha = findFirstAvailableHour2(fecha);
    }
    const nextDates = dates.map((c, i) => {
      if (i === index) {
        return fecha;
      } else {
        return c;
      }
    })
    setDates(nextDates);
    
    let disponible = await verifyDate2(fecha, index);
    
    const nextAvailable = available.map((c, i) => {
      if (i === index) {
        return disponible;
      } else {
        return c;
      }
    })
    setAvailable(nextAvailable);
  }

  useEffect(async () => {
    await changeHandler(firstAvailableHour, 0);
    setIsFirstDate(true);
  }, [])

  const excludeDates = () => {
    let aux = [... dates];
    aux.push(today);
    return aux
  }

  const  checkAvailable = () => {
    let onlyDate = new Array(appointment.state.appointmentQuantity).fill("");
    for (let i=0; i<onlyDate.length; i++) {
      onlyDate[i] = moment(dates[i]).format().split('T')[0];

      if (available[i] === false) {
        return false;
      }
    }

    let unique = new Set(onlyDate);
    let differentDays = (unique.size === onlyDate.length);
    let allAvailable = available.every((obj) => obj); 
    return allAvailable && differentDays;
  }

  const createPickers = () => {
    let auxArray = new Array(appointment.state.appointmentQuantity).fill(1);
    return auxArray.map((obj, index) => {
      return (
        <>
            <div className="onePage-calendar-box">
                <div className="onePage-calendar-top-box">
                  <h3 className="onePage-calendar-box-day">Día {index+1}</h3>
                  <div className="onePage-calendar-top-calendar-container">
                    <DatePicker
                      className="onePage-calendar"
                      placeholderText="DD/MM/AAAA"
                      dateFormat="dd/MM/yyyy"
                      excludeDates={excludeDates()}
                      minDate={subDays(new Date(), 0)}
                      onChange={async (fecha) => await changeHandler(fecha, index, 1)}
                      locale="es"
                      popperPlacement="bottom"
                      portalId="root-portal"
                      selected={dates[index]}
                    />
                    <DatePicker
                      className="onePage-calendar"
                      popperPlacement="bottom"
                      placeholderText="HH:MM"
                      selected={dates[index]}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Hora Inicio"
                      timeFormat="HH:mm"
                      dateFormat="HH:mm"
                      filterTime={filterPassedTime}
                      onChange={async (fecha) => await changeHandler(fecha, index, 0)}
                      portalId="root-portal"
                    />
                  </div>
                </div>

                <div className="onePage-calendar-info">
                  <p className="onePage-calendar-info__text">{(available[index])  ? "Tu Moper llegará el " + moment(dates[index]).format("DD/MM/YY") +  " a las " + moment(dates[index]).format("HH:mm") + " hrs." : "Nuestros Mopers están ocupados en este horario, prueba seleccionando otro."}</p>
                  <p className="onePage-calendar-info__text">Tu servicio tendrá una duración de {Math.floor(appointment.state.duration/60)} hrs. </p>
                </div>
            </div>
            
          
        </>
      )
    })
  }


  if (isFirstDate === false) {
    return <> 
      <div className="loader-top">
        <Loader  active inline='centered' >Cargando calendario</Loader>
      </div>
    </>;
  } else {
    return (
      <>
        <div className='onePage-calendar-container'>
          <ModalCalendar
            active = {blockedDay}
            info = {messageInformation}
            setBlockedDay = {setBlockedDay}
          />
          <div className="onePage-calendar-title-container2">
            <div className="onePage-calendar-title-container">
              <h1 className="onePage-calendar-title">¡Agendemos!</h1>
              <div className="onePage-calendar-popup">
                <Popup
                  trigger={<Icon name='question circle outline'  color='blue' size='big' />}
                  wide='very'
                  content={""}
                  position='bottom center'
                />

              </div>
            </div>
          </div>
          {createPickers()}
          <div className="appointment-button-container2">
              <button
                className="appointment-button__prev"  
                onClick={() => navigate(route.path_prev)} 
              >
                Volver
              </button>
              <button
                className={checkAvailable() ? "appointment-button__next" : "appointment-button__disabled"}
                disabled={checkAvailable()? false : true}
                onClick={() => {
                  addTimes();
                  navigate(route.path_next);
                  window.scrollTo({ top: 0, behavior: 'smooth' });

                }}
              >
                Siguiente
              </button>
          </div>
        </div>
      </>
    );
  }
}
export default OnePageCalendar;