import {useState, useReducer, useEffect} from 'react';
import Input from './Input';
import useImage from '../hooks/useImage';

const initialState = {
  bill: 0,
  tip: 0,
  tipValues: [5, 10, 15, 25, 50],
  people: 0,
  tipAmount: 0,
  total: 0,
  activatedBtnIndex: '',
  hasFocused: false,
  allInputIsValid: false,
};

function reducer(state, action) {
  const {people} = state;
  const {type, payload} = action;
  if (type === 'BILL_VALUE') {
    return {
      ...state,
      bill: +payload,
    };
  }
  if (type === 'TIP_VALUE') {
    const {tip, indexActiveBtn} = payload;
    return {
      ...state,
      tip,
      activatedBtnIndex: indexActiveBtn,
    };
  }
  if (type === 'CUSTOM_TIP_VALUE') {
    return {
      ...state,
      tip: +payload,
      activatedBtnIndex: '',
    };
  }
  if (type === 'PERSONS') {
    return {
      ...state,
      people: +payload,
    };
  }
  if (type === 'CALCULATE_TIP_AMOUNT') {
    const total = payload * people;
    return {
      ...state,
      tipAmount: payload,
      total,
      allInputIsValid: true,
    };
  }
  if (type === 'RESET_RESULTS') {
    if (payload === 'resetAll') {
      return {
        ...state,
        bill: 0,
        tip: 0,
        people: 0,
        tipAmount: 0,
        activatedBtnIndex: '',
        hasFocused: false,
        allInputIsValid: false,
      };
    }
    return {
      ...state,
      tipAmount: 0,
      total: 0,
      allInputIsValid: false,
    };
  }
  if (type === 'INPUT_FOCUS') {
    return {
      ...state,
      hasFocused: true,
    };
  }

  return state;
}

export default function Index() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    bill,
    tip,
    tipValues,
    people,
    tipAmount,
    total,
    activatedBtnIndex,
    hasFocused,
    allInputIsValid,
  } = state;
  const {image: logo_image, error: logoHasError} = useImage('logo.svg');
  const calculatedTip = tipAmount.toFixed(2);
  const calculatedTotal = total.toFixed(2);

  function tipButtonClickHandler(e, index) {
    const tip = Number.parseInt(e.target.textContent);
    dispatch({type: 'TIP_VALUE', payload: {tip, indexActiveBtn: index}});
  }

  useEffect(() => {
    function calculateTipAmount() {
      if (bill > 0 && tip > 0 && people > 0) {
        const tipAmount = (bill * tip) / 100 / people;
        dispatch({type: 'CALCULATE_TIP_AMOUNT', payload: tipAmount});
      } else {
        dispatch({type: 'RESET_RESULTS'});
      }
    }
    calculateTipAmount();
  }, [bill, tip, people]);

  return (
    <main className="main">
      <header>
        <img src={logo_image} alt="logo" className="logo" />
      </header>
      <main className="calculator">
        <section className="billCalculator">
          <section className="bill">
            <Input
              label="Bill"
              labelClass="title"
              type="number"
              id="billInput"
              value={bill}
              inputClass="billInput"
              placeholder="0"
              onChange={e =>
                dispatch({type: 'BILL_VALUE', payload: e.target.value})
              }
              onClick={e => e.preventDefault()}
            />
          </section>
          <section className="tip">
            <label className="title">Select Tip %</label>
            <div className="tipBtns">
              {tipValues.map((tip, index) => (
                <button
                  key={tip}
                  className={`tipBtn ${
                    activatedBtnIndex === index ? 'activeBtn' : ''
                  }`}
                  type="button"
                  onClick={e => tipButtonClickHandler(e, index)}
                >
                  {tip}%
                </button>
              ))}
              <input
                id="customInput"
                type="number"
                className={`customInput ${false ? 'invalid' : ''}`}
                placeholder="Custom"
                onChange={e =>
                  dispatch({type: 'CUSTOM_TIP_VALUE', payload: e.target.value})
                }
              />
            </div>
          </section>
          <section className="people">
            <Input
              label="Number of People"
              labelClass="title"
              type="number"
              id="peopleInput"
              inputClass={`peopleInput ${
                people === 0 && hasFocused ? 'error' : ''
              }`}
              value={people}
              placeholder="0"
              onChange={e =>
                dispatch({type: 'PERSONS', payload: e.target.value})
              }
              onFocus={() => dispatch({type: 'INPUT_FOCUS'})}
            />
          </section>
        </section>
        <section className="total">
          <div className="totalInfo">
            <p>
              Tip Amount <br />
              <span>/ person</span>
            </p>
            <p
              className={`calculateAmount ${
                `${calculatedTip}`.length > 6 ? 'smallSize' : ''
              }`}
            >
              ${calculatedTip}
            </p>
            <p>
              Total <br />
              <span>/ person</span>
            </p>
            <p
              className={`calculateAmount ${
                `${calculatedTotal}`.length > 6 ? 'smallSize' : ''
              }`}
            >
              ${calculatedTotal}
            </p>
          </div>
          <button
            type="reset"
            className="resetBtn"
            disabled={!allInputIsValid ? true : false}
            onClick={() =>
              dispatch({type: 'RESET_RESULTS', payload: 'resetAll'})
            }
          >
            Reset
          </button>
        </section>
      </main>
    </main>
  );
}
