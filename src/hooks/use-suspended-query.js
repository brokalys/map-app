import { useQuery } from '@apollo/client';

const suspend = (promise) => {
  let status = 'pending';
  let response;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );

  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };
  const result = { read };

  return result;
};

export default function useSuspendableQuery(...args) {
  const result = useQuery(...args);
  if (result.loading) {
    suspend(new Promise((resolve) => !result.loading && resolve())).read();
  }
  return result;
}
