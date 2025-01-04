import Layout from '@/components/ClientLayout';
import RegisterForm from '@/components/RegisterForm';
import ToggleColorMode from '@/components/ToggleColorMode';

const Register = () => {
  return (
    <Layout>
      <h2>Register</h2>
      <RegisterForm />
      <ToggleColorMode />
    </Layout>
  );
};

export default Register;
