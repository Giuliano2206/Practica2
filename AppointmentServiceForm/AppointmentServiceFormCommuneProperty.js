import React, { useContext, useState, useEffect } from 'react'
import { Form, Select } from 'semantic-ui-react'
import { AppointmentContext } from "../../../context/appointment/AppointmentContext"
import { CommuneContext } from "../../../context/commune/CommuneContext";
import AppointmentPropertyTypeSelector from "./PropertyTypeSelector";

const AppointmentServiceFormCommuneProperty = ({ onClickChanger }) => {
  const { state, updatePropertyType, updateAddress } = useContext(AppointmentContext);
  const { allCommunes } = useContext(CommuneContext);
 
  const [address, setAddress] = useState(state.address);

  function renderServiceForm() {
      return (
        <>
          <div className="appointment-propCom-container">
            <AppointmentPropertyTypeSelector
              mode = "mobile"
              updatePropertyType={updatePropertyType}
              onClickChanger={ () => onClickChanger() }
              state={state}
            />

            <Form >
              <Form.Field
                  search
                  className=''
                  control={Select}
                  options={allCommunes.allCommunes}
                  placeholder="COMUNA"
                  value={address.communeId}
                  onChange={(e, { value }) => {
                    let searchedCommune = allCommunes.allCommunes.find(
                      (commune) => commune.value === value
                    )
                    const auxAddress = {
                      ...address,
                      region: searchedCommune.region,
                      communeId: value,
                      commune: searchedCommune.text,
                    }
                    setAddress(auxAddress);
                    updateAddress(auxAddress);
                    onClickChanger();
                  }
                  }
              />
            </Form>
            
            <AppointmentPropertyTypeSelector
              mode = "desktop"
              updatePropertyType={updatePropertyType}
              onClickChanger={ () => onClickChanger() }
              state={state}

            />
          
          </div>

        </>
      );
    }
  return (
      <>
          {renderServiceForm()}
      </>
  )
}

export default AppointmentServiceFormCommuneProperty;