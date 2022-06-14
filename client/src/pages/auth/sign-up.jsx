import { useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, request } = useRequest();

  const onSubmit = async (e) => {
    e.preventDefault();

    await request({
      url: '/api/users/signup',
      method: 'post',
      body: { email, password }
    }, () => {
      router.push('/');
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input value={email}
               onChange={(e) => setEmail(e.target.value)}
               type="email"
               className="form-control"
               id="email"
               aria-describedby="emailHelp"
               placeholder="Enter email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input value={password}
               onChange={(e) => setPassword(e.target.value)}
               type="password"
               className="form-control"
               id="password"
               placeholder="Password"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

SignUp.defaultProps = {};


export default SignUp;