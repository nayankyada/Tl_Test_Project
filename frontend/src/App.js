//#Global Imports
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, useNavigate } from 'react-router-dom';

//#Local Impoprts
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import Home from './pages/home';
import ManageRole from './pages/manage-role';
import ManageBike from './pages/manage-bike';
import MyBike from './pages/my-bike';
import NotFoundPage from './pages/not-found';
import PrivateRoute from './hoc/usePrivateRoute';
import { UserConfigContext } from './context';

//CSS Import
import './assets/css/global.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const { user } = useContext(UserConfigContext);

  useEffect(() => {
    if (user?.uid) {
      navigate('/home');
    }
  }, [user]);

  return (
    <div>
      <Routes>
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/manage-role" element={<ManageRole />} />
          <Route path="/manage-bike" element={<ManageBike />} />
          <Route path="/my-bike" element={<MyBike />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
