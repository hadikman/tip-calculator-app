import {useReducer, useEffect} from 'react';
import Input from './Input';
import useImage from '../hooks/useImage';

const initialState = {
  bill: '',
  tip: 0,
  tipValues: [5, 10, 15, 25, 50],
  customTip: '',
  people: '',
  tipAmount: 0,
  total: 0,
  activatedBtnIndex: '',
  billHasFocused: false,
  peopleHasFocused: false,
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
      customTip: '',
    };
  }
  if (type === 'CUSTOM_TIP_VALUE') {
    return {
      ...state,
      customTip: +payload,
      activatedBtnIndex: '',
      tip: 0,
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
        bill: '',
        tip: 0,
        people: '',
        customTip: '',
        tipAmount: 0,
        activatedBtnIndex: '',
        billHasFocused: false,
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
  if (type === 'BILL_INPUT_FOCUS') {
    return {
      ...state,
      billHasFocused: true,
    };
  }
  if (type === 'PEOPLE_INPUT_FOCUS') {
    return {
      ...state,
      peopleHasFocused: true,
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
    customTip,
    people,
    tipAmount,
    total,
    activatedBtnIndex,
    billHasFocused,
    peopleHasFocused,
    allInputIsValid,
  } = state;
  const {image: logo_image, error: logoHasError} = useImage('logo.svg');
  const calculatedTip = tipAmount.toFixed(2);
  const calculatedTotal = total.toFixed(2);

  function calculateTip(bill, tipInput, people) {
    const tipAmount = (bill * tipInput) / 100 / people;
    dispatch({type: 'CALCULATE_TIP_AMOUNT', payload: tipAmount});
  }

  function tipButtonClickHandler(e, index) {
    const tip = Number.parseInt(e.target.textContent);
    dispatch({type: 'TIP_VALUE', payload: {tip, indexActiveBtn: index}});
  }

  useEffect(() => {
    function calculateTipAmount() {
      if (bill > 0 && tip > 0 && people > 0) {
        calculateTip(bill, tip, people);
        return;
      }
      if (bill > 0 && customTip > 0 && people > 0) {
        calculateTip(bill, customTip, people);
        return;
      }

      dispatch({type: 'RESET_RESULTS'});
    }
    calculateTipAmount();
  }, [bill, tip, people, customTip]);

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
              inputClass={`billInput ${
                bill === 0 && billHasFocused ? 'error' : ''
              }`}
              placeholder="0"
              showAlertMessage={bill === 0}
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
                value={customTip}
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
                people === 0 && peopleHasFocused ? 'error' : ''
              }`}
              value={people}
              placeholder="0"
              showAlertMessage={people === 0}
              onChange={e =>
                dispatch({type: 'PERSONS', payload: e.target.value})
              }
              onFocus={() => dispatch({type: 'PEOPLE_INPUT_FOCUS'})}
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
