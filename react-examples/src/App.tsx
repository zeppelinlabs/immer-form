import React from 'react';
import { SubmitHandler, useField, useImmerForm } from 'immer-form';

type FormExample = {
  name: string,
  age: number,
}

function App() {

  const getDefaultValues = () => {
    return {
      name: "Mary",
      age: 25
    }
  }

  const {
    token,
    handleSubmit,
    formState: {
      submittable,
    },
  }
    = useImmerForm<FormExample>({
      defaults: getDefaultValues(),
    })

  const {
    value: nameValue,
    onChange: onNameChange,
    onBlur: onNameBlur,
  } = useField({ token: token, attr: "name" })

  const {
    value: ageValue,
    onChange: onAgeChange,
    onBlur: onAgeBlur,
  } = useField({ token: token, attr: "age" })

  const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
    await alert(`Submitted: ${submitObject.name} - ${submitObject.age}`)
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameBlur}
          />
        </label>
        <br />
        <label htmlFor="age">
          Age
          <input
            id="age"
            type="number"
            value={ageValue}
            onChange={(e) => onAgeChange(Number(e.target.value))}
            onBlur={onAgeBlur}
          />
        </label>
        <br />
        <button
          disabled={!submittable}
          type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
