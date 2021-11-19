import React from 'react';
import {
  SubmitHandler,
  useField,
  useImmerFormYup,
  useSyncErrorsWithBrowser
} from "immer-form/Validators/YupValidator";
import * as yup from 'yup';

type FormExample = {
  name: string,
  age: number,
}

const useFormValidation = () => {
  const schema: yup.SchemaOf<FormExample> = yup.object().shape({
    name: yup.string().required(),
    age: yup.number().required(),
  })
  return schema
}

const App = () => {

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
    = useImmerFormYup<FormExample>({
      defaults: getDefaultValues(),
      validator: useFormValidation(),
    })

  const {
    value: nameValue,
    onChange: onNameChange,
    onBlur: onNameBlur,
    subToken: nameToken,
  } = useField({ token: token, attr: "name" })

  const {
    value: ageValue,
    onChange: onAgeChange,
    onBlur: onAgeBlur,
    subToken: ageToken,
  } = useField({ token: token, attr: "age" })

  const refName = useSyncErrorsWithBrowser<HTMLInputElement>({ token: nameToken, })
  const refAge = useSyncErrorsWithBrowser<HTMLInputElement>({ token: ageToken, })

  const onSubmit: SubmitHandler<FormExample> = async (submitObject) => {
    await alert(`Submitted: ${submitObject.name} - ${submitObject.age}`)
  }

  return (<div>
    <div className="container">
      <div>
        <h1>Change me<h1 className={"exclamation"}>!</h1></h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <label htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={onNameBlur}
            ref={refName}
          />

        </p>
        <p>
          <label htmlFor="age">
            Age:
          </label>
          <input
            id="age"
            type="text"
            value={ageValue}
            onChange={(e) => onAgeChange(Number(e.target.value))}
            onBlur={onAgeBlur}
            ref={refAge}
          />

        </p>
        <br />
        <button
          disabled={!submittable}
          type="submit">Submit</button>
      </form>
    </div>
  </div>
  );
}

export default App;