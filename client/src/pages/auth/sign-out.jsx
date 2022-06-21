import { useEffect } from "react";
import { useRequest } from "../../hooks/useRequest";
import { useRouter } from "next/router";

const SignOut = () => {
  const router = useRouter();
  const { errors, request } = useRequest();

  useEffect(() => {
    request({
      url: '/api/users/sign-out',
      method: 'post',
    }, () => {
      router.push('/');
    }).then();
  }, [])

  return (
    <div>Signin out...</div>
  );
};

SignOut.defaultProps = {};


export default SignOut;