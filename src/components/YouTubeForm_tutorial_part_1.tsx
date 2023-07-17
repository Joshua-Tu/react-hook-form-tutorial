// This part includes:
// useForm hook
//* Managing form state (formState from useForm())
//* DevTools visualization (import { DevTool } from '@hookform/devtools')
//* Form State and Renderer 
//* Form Submission (handleSubmit from useForm())
//* Form Validation (validate in register from useForm(), in html element)
//* Display Error Message (errors from formState and rendering in html element)
//* Custom validation (validate in register from useForm(), supports custom validation function)
//* Enhancing React Hook Form ()
//* Default Values (defaultValues for useForm(), supports async function)
//* Nested Objects (register('social.twitter') from useForm())
//* Arrays (register('phoneNumbers.0') from useForm())
//* Dynamic Fields (useFieldArray() from useForm())
//* Numeric and Date Values  (register('age') from useForm(), register('dob') from useForm())
//* Watch Field Values (watch() from useForm())
//* Get Field Values (getValues() from useForm())
//* Set Field Values (setValue() from useForm())
//* Touched and Dirty State (touchedFields, dirtyFields, isDirty from formState，注意isDirty是指整个formState是不是dirty，而不是指代某个单独的field是不是dirty)
//* Disable Form Field (disabled in register from useForm(), also conditional disable is supported, find use case in twitter field)
//* Handle submision error (handleSubmit from useForm(), handle submit can have second argument for error handling)
//* Disable Form Submission (examples in this YouTubeForm component: disable the submit button when the user has not add any inputs,"disabled={!isDirty}", and then if the form is valid, use isValid from formState)
//* Form Submission State (isSubmitting, isSubmitted, isSubmitSuccessful, submitCount from formState)
//* reset form (reset from useForm(), 不推荐在onSubmit里面call reset(), 最好放在useEffect里面，配合isSubmitSuccessful一起使用)
//* Async validation (validate in register from useForm(), supports async function, use case in email field)
//* Validation Modes automatically (mode in useForm(), default is onChange, can be set to onBlur, onSubmit, onTouched)
//* Validation Manually (trigger from useForm(), trigger can have second argument for error handling, if passed with one argument, the argument is the field name, if no argument passed, all fields will be validated)

import { useEffect } from 'react';
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from '@hookform/devtools';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: Array<string>;
  // dynamic fields
  phNumbers: {
    number: string;
  }[],
  age: number;
  dob: Date;
};

const YouTubeForm = () => {
  renderCount++;

  const form = useForm<FormValues>({
    defaultValues: {
      username: 'Batman',
      email: '',
      channel: '',
      social: {
        twitter: '',
        facebook: '',
      },
      phoneNumbers: ['', ''],
      phNumbers: [{ number: '' }],
      age: 0,
      dob: new Date(),
    },
    mode: 'onTouched',  //* default is onChange, can be set to onBlur, onSubmit, onTouched and all(onBlur, onChange, onSubmit)
    // mode: 'all'
    // defaultValues: async () => {
    //   const response = await fetch(
    //     "https://jsonplaceholder.typicode.com/users/1"
    //   );
    //   const data = await response.json();
    //   return {
    //     username: data.username,
    //     email: data.email,
    //     channel: '',
    //   }
    // }
  });
  const { 
    register, 
    control, 
    handleSubmit, 
    formState, 
    watch, 
    getValues, 
    setValue,
    reset,
    trigger
  } = form;
  // const { name, ref, onChange, onBlur } = register('username');

  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  console.log({ isSubmitting, isSubmitted, isSubmitSuccessful, submitCount });
  // console.log('🚀 ~ file: YouTubeFOrm.tsx:81 ~ isSubmitting:', isSubmitting);
  // console.log({ touchedFields, dirtyFields, isDirty, isValid });

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });
    return subscription.unsubscribe();
  }
  , [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [reset, isSubmitSuccessful]);

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted', data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log('Form Errors', errors);
  }

  const handleGetValues = () => {
    // console.log({ formState: getValues() });
    // console.log({ social: getValues('social') });
    // console.log({ twitter: getValues('social.twitter') });
    console.log('Get Values', getValues(['username', 'channel']));
  };

  const handleSetValue = () => {
    setValue('username', '', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue('social.twitter', 'Superman Twitter');
  };

  // const username = watch('username');
  const [username, email] = watch(['username', 'email']);
  // const watchForm = watch();

  return (
    <div>
      <h1>YouTube Form ({renderCount / 2}) </h1>
      <h2>
        Watched value: {username} {email}
      </h2>
      {/* <h2>Watched value: {JSON.stringify(watchForm)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className='form-control'>
          <label htmlFor='username'>Username</label>
          {/* <input
          type='text'
          id='username'
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
        /> */}
          <input
            type='text'
            id='username'
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <p className='error'>{errors.username?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='email'>E-mail</label>
          <input
            type='email'
            id='email'
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email address",
              },
              // validate: (fieldValue) => {
              //   return fieldValue.toLowerCase() !== 'admin@example.com' || 'Enter a different email address'
              // }
              validate: {
                notAdmin: (fieldValue) =>
                  fieldValue.toLowerCase() !== "admin@example.com" ||
                  "Enter a different email address",
                notBlackListed: (fieldValue) =>
                  !fieldValue.endsWith("baddomain.com") ||
                  "This domain is not supported",
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length === 0 || "Email already exists";
                },
              },
            })}
          />
          <p className='error'>{errors.email?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='channel'>Channel</label>
          <input
            type='text'
            id='channel'
            {...register("channel", {
              required: "Channel is required",
            })}
          />
          <p className='error'>{errors.channel?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='twitter'>Twitter</label>
          <input
            type='text'
            id='twitter'
            {...register("social.twitter", {
              required: "Twitter is required",
              // disabled: true,
              //* conditional disabled
              disabled: watch("channel") === "",
            })}
          />
          <p className='error'>{errors.social?.twitter?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='facebook'>Facebook</label>
          <input
            type='text'
            id='facebook'
            {...register("social.facebook", {
              required: "Facebook is required",
            })}
          />
          <p className='error'>{errors.social?.facebook?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='primary-phone'>Primary Phone Number</label>
          <input
            type='text'
            id='primary-phone'
            {...register("phoneNumbers.0", {
              required: "Primary phone number is required",
            })}
          />
        </div>

        <div className='form-control'>
          <label htmlFor='secondary-phone'>Secondary Phone Number</label>
          <input
            type='text'
            id='secondary-phone'
            {...register("phoneNumbers.1", {
              required: {
                value: true,
                message: "Secondary phone number is required",
              },
            })}
          />
        </div>

        <div>
          <label htmlFor=''>List of phone numbers</label>
          <div>
            {fields.map((field, index) => (
              <div className='form-control' key={field.id}>
                <input
                  type='text'
                  {...register(`phNumbers.${index}.number` as const)}
                />
                {index > 0 && (
                  <button type='button' onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type='button' onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>

        <div className='form-control'>
          <label htmlFor='age'>Age</label>
          <input
            type='number'
            id='age'
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
            })}
          />
          <p className='error'>{errors.age?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='dob'>Date of birth</label>
          <input
            type='date'
            id='dob'
            {...register("dob", {
              required: "Date of birth is required",
              valueAsDate: true,
            })}
          />
          <p className='error'>{errors.dob?.message}</p>
        </div>

        <button disabled={!isDirty || isSubmitting}>Submit</button>
        <button type='button' onClick={() => reset()}>
          Reset Form
        </button>
        <button type='button' onClick={handleGetValues}>
          Get values
        </button>
        <button type='button' onClick={handleSetValue}>
          Set value
        </button>
        {/* <button type='button' onClick={() => trigger()}>  
          Validate
        </button> */}
        <button type='button' onClick={() => trigger('channel')}>  
          Validate Channel
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;