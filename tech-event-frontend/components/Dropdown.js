import { useState } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <div className="relative">
      <label className="block text-gray-700">{label}</label>
      <div className="border rounded-lg p-2 cursor-pointer bg-white shadow-lg">
        <span>{selected}</span>
      </div>
      <div className="absolute w-full border rounded-lg bg-white shadow-lg mt-1">
        {options.map((option, index) => (
          <div
            key={index}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
