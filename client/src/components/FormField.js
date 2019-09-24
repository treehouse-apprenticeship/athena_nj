import React from 'react';

export default ({ 
    fieldName, 
    handleChange, 
    label, 
    type = 'text', 
    value, 
    className = '',
    displayLabel = false 
  }) => {
    let control = null;

    switch (type) {
      case 'textarea':
        control = <textarea id={fieldName} name={fieldName} 
          value={value} onChange={handleChange} className={className}
          placeholder={displayLabel === false ? label : ''} />;
        break;
      case 'text':
      case 'password':
      default:
        control = <input id={fieldName} name={fieldName} type={type} 
          value={value} onChange={handleChange} className={className}
          placeholder={displayLabel === false ? label : ''} />;
        break;
    }

    return (
      <div>
        {displayLabel &&
          <label htmlFor={fieldName}>{label}:</label>
        }
        {control}
      </div>
    );
}
