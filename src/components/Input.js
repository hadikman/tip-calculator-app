import {Fragment} from 'react';

export default function Input(props) {
  const {
    label,
    labelClass,
    id,
    type,
    inputClass,
    placeholder,
    invalid,
    onChange,
    onClick,
    onFocus,
    value,
    showAlertMessage,
  } = props;

  return (
    <Fragment>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {showAlertMessage && <span className="alertMessage">Can't be zero</span>}
      <input
        id={id}
        type={type}
        className={`${inputClass} ${invalid ? 'invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={onClick}
        onFocus={onFocus}
      />
    </Fragment>
  );
}
