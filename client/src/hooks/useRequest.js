import { useState } from "react";
import axios from "axios";

export const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const request = async ({ url, method, body }, cb) => {
    setIsLoading(true);
    try {
      const response = await axios[method](url, body);
      setIsLoading(false);
      setErrors(null);
      await cb(response.data);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  return { isLoading, errors, request };
}