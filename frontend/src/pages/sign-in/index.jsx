//#Global Imports
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//#Local Imports
import db, { auth } from '../../firebase';
import { UserConfigContext } from '../../context';
import { getErrorMessage, regexForEmailAddress, regexForPassword } from '../../utils';

function SignIn() {
  const navigate = useNavigate();
  const { setHandleUser } = React.useContext(UserConfigContext);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (values) => {
    const email = values.email;
    const password = values.password;
    auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        db.collection('users')
          .where('uid', '==', response.user.uid)
          .get()
          .then((snap) => {
            let snapData = snap.docs[0].data();
            setHandleUser({
              id: snap.docs[0].id,
              uid: snapData.uid,
              fullName: snapData.fullName,
              email: snapData.email,
              role: snapData.role
            });
            toast.success('Sign In Successful');
            navigate('/home');
          })
          .catch(() => {
            toast.error('Something went wrong!, Please try again later');
          });
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          toast.error('User is not Registered');
        } else if (error.code === 'auth/wrong-password') {
          toast.error('Wrong Password');
        } else {
          toast.error('Something went wrong. Please try again later');
        }
      });
  };

  return (
    <div className="min-h-[100vh] flex">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <img
              className="w-auto h-12"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-600">Sign in to your account</h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <div className="space-y-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full gap-8 m-auto mt-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        {...register('email', {
                          required: true,
                          pattern: regexForEmailAddress
                        })}
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm font-semibold text-red-500">
                        {getErrorMessage(errors, 'email', 'Email Address')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password', {
                          required: true,
                          minLength: 8,
                          pattern: regexForPassword
                        })}
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm font-semibold text-red-500">
                        {getErrorMessage(errors, 'password', 'Password')}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Sign in
                    </button>
                  </div>
                </form>
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <div
                      onClick={() => navigate('/auth/sign-up')}
                      className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                      Not Registered User?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src="/images/bike-rental-bg.jpg"
          alt="bike-rental-bg"
        />
      </div>
    </div>
  );
}

export default SignIn;
