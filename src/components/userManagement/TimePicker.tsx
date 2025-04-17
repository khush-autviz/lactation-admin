import React, { useState } from 'react';

function TimePicker() {
  const [selectedTime, setSelectedTime] = useState('');

  // Generate time options
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hh = hour.toString().padStart(2, '0');
      const mm = min.toString().padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }

  const handleChange = (e: any) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <label htmlFor="time-picker" style={{ display: 'block', marginBottom: '10px' }}>
        Select Time (24-Hour Format)
      </label>
      <select
        id="time-picker"
        value={selectedTime}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      >
        <option value="">-- Select Time --</option>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>

      {selectedTime && (
        <p style={{ marginTop: '15px' }}>
          You selected: <strong>{selectedTime}</strong>
        </p>
      )}
    </div>
  );
}

export default TimePicker;
