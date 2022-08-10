import {useState} from 'react';
import Login from "./Login";
import Register from "./Register";

const LoginRegister = () => {
  // const router = useRouter();
  const [loginRegister, setLoginRegister] = useState({login: true, register: false})

  return (
    <div className='details-details-container'>
      {
        loginRegister.login? (
          <Login setLoginRegister={setLoginRegister}/>
        ):''
      }
      {
        loginRegister.register? (
          <Register setLoginRegister={setLoginRegister} />
        ):''
      }
    </div>
  );
};

export default LoginRegister;