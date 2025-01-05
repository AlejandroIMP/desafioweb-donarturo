import AuthLayout from '@/layouts/AuthLayout';
import RegisterForm from '@/components/RegisterForm';
import ToggleColorMode from '@/components/ToggleColorMode';

const Register = () => {
  return (
    <AuthLayout>
      <h2>Register</h2>
      <RegisterForm />
      <ToggleColorMode />
    </AuthLayout>
  );
};

export default Register;
