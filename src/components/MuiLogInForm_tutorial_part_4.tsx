//* Material UI Integration
//* step 1: install material-ui

//* step 2: 
import { TextField, Button, Stack, Step } from '@mui/material';
//* step 3:
import { useForm, FieldErrors } from "react-hook-form";
import { DevTool } from '@hookform/devtools';

type FormValues = {
  email: string;
  password: string;
};

//* step 4
const MuiLogInForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const onsubmit = (data: FormValues) => {
    console.log(data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log('Form Errors', errors);
  }

  return (
    <>
      <h1>Log In</h1>
      <form noValidate onSubmit={handleSubmit(onsubmit, onError)}>
        <Stack spacing={2} width={400}>
          <TextField
            label='Email'
            type='email'
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <TextField
            label='Password'
            type='password'
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Button variant='contained' color='primary' type='submit'>
            Log In
          </Button>
        </Stack>
      </form>
      <DevTool control={control} />
    </>
  );
};

export default MuiLogInForm;