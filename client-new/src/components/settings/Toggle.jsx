import React from 'react';

const Toggle = ({ enabled, onChange }) => {
 return (
 <label className="pro-toggle">
 <input
 type="checkbox"
 checked={enabled}
 onChange={e => onChange(e.target.checked)}
 />
 <span className="pro-toggle-track" />
 </label>
 );
};

export default Toggle;
