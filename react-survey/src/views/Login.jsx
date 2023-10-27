import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({__html: ''});

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({__html: ''})

    axiosClient.post('/login', {
      email,
      password
    })
      .then(({data}) => {
        setCurrentUser(data.user)
        setUserToken(data.token)
      })
    .catch((error) => {
      if(error.response) {
        // const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) => [...accum, ...next], [])
        
        // setError({__html: finalErrors.join('<br>')})
        if (error.response.status === 422 && error.response.data.error === 'The provided credentials are not correct') {
          // Handle the "wrong password" error here
          setError({ __html: error.response.data.error });
        } else {
          const finalErrors = Object.values(error.response.data.errors).reduce(
            (accum, next) => [...accum, ...next],
            []
          );
          setError({ __html: finalErrors.join('<br>') });
        }
      }
      console.error(error)
    });
}

    return (
      <>
        
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-grtextlight">
              Sign in to your account
            </h2>
  
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">

          {error.__html && (<div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}></div>)}

            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-grtextlight">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grnavgreen sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-grtextlight">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-emerald-400 hover:text-emerald-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grnavgreen sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-emerald-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grbtnhover"
                >
                  Sign in
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-emerald-400 hover:text-emerald-500">
                Register
              </Link>
            </p>
          </div>

      </>
    )
  }
  