import AuthLayout from '@/layouts/AuthLayout';
import RegisterForm from '@/components/RegisterForm';
import ToggleColorMode from '@/components/ToggleColorMode';

const Register = () => {
  return (
    <AuthLayout>
      <h1>Register</h1>
      <div className='auth-form--container'>
        <RegisterForm />
        <ToggleColorMode />
      </div>
    </AuthLayout>
  );
};

export default Register;
