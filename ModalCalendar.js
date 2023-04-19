import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import moment from "moment";

function ModalCalendar({ active, info, setBlockedDay }) {
    let dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
    let monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return (
        <Modal
        onClose={() => {
            setBlockedDay(false);
        }}
        open={active}
        size='tiny'
        >
        <Header icon='calendar times outline' content={"¡Ups! No hay horarios disponibles para el " + dayNames[info.initialDate.getDay()] + " " + info.initialDate.getDate() + " de " + monthNames[info.initialDate.getMonth()] + "."}/>
        <Modal.Content>
            <p>
            ¡No te preocupes! Te agendamos para la fecha más cercana: {dayNames[info.dateAvailable.getDay()] + " " + info.dateAvailable.getDate() + " de " + monthNames[info.dateAvailable.getMonth()] }.
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button color='blue' onClick={() => setBlockedDay(false)}>
                OK
            </Button>
        </Modal.Actions>
        </Modal>
    )
}

export default ModalCalendar