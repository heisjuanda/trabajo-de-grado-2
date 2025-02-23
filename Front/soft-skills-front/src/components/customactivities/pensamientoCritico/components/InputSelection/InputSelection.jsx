import React, { useState } from "react";

import "./InputSelection.css"

function InputSelection({ options, onSelect }) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <div className="input-select">
      <label className="input-select__label"><b>Tema de debate:</b></label>
      <select
        className="input-select__field"
        value={selectedValue} 
        onChange={handleChange}
      >
        <option className="input-select__option" value="">-- Seleccionar --</option>
        {options.map((option) => (
          <option 
            className="input-select__option"
            key={option.value} 
            value={option.value}
          >
            {option.option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InputSelection;