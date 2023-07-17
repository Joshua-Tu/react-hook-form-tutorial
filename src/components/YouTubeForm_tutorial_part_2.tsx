//* Yup Integration (Yub is a schema validation library)
//* step 1: npm i yup @hookform/resolvers

import { useEffect } from 'react';
import { useForm, FieldErrors } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
//* step 2: import { yupResolver } from '@hookform/resolvers/yup';
//* step 2: import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//* step 3: define yub validation schema
const schema = yup.object().shape({
  username: yup.string().required('Enter a username'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  channel: yup.string().required('Channel is required'),
});

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

const YupYouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      email: '',
      channel: ''
    },
    //* step 4: register yup resolver to hook form, yup validation message 比hook-form的shcema validation message优先级更高
    resolver: yupResolver(schema),
  });
  const { 
    register, 
    control, 
    handleSubmit, 
    formState, 
    watch, 
    reset,
  } = form;

  const { errors, isSubmitting, isSubmitSuccessful } = formState;

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

  const [username, email] = watch(['username', 'email']);

  return (
    <div>
      <h1>YouTube Yup Form </h1>
      <h2>
        Watched value: {username} {email}
      </h2>
      {/* <h2>Watched value: {JSON.stringify(watchForm)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className='form-control'>
          <label htmlFor='username'>Username</label>
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

        <button disabled={isSubmitting}>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YupYouTubeForm;