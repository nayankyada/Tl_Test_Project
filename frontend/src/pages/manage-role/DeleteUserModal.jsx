//#Global imports
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { UserConfigContext } from '../../context';
import db from '../../firebase';

function DeleteUserModal({ setActionType, selectedUserData }) {
  const { user } = useContext(UserConfigContext);
  const deleteBike = () => {
    if (user.uid === selectedUserData.uid) {
      toast.error('You can not delete your self from system');
      setActionType('');
      return;
    }
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/deleteUser?uid=${selectedUserData.uid}`, {
      method: 'GET',
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
      .then(() => {
        db.collection('trips')
          .where('uid', '==', selectedUserData.uid)
          .get()
          .then((data) => {
            let batch = db.batch();
            data.docs
              .map((d) => d.id)
              .forEach((id) => {
                let ref = db.collection('trips').doc(id);
                batch.delete(ref);
              });
            batch.commit().then(() => {
              db.collection('users')
                .doc(selectedUserData.id)
                .delete()
                .then(() => {
                  toast.success('User deleted');
                  setActionType('');
                });
            });
          })
          .catch(() => {
            toast.error('No bike found');
          });
      })
      .catch(() => {
        toast.error('No User Found');
      });
  };

  return (
    <div className="text-lg font-bold">
      Are you sure to cancel the selected ride ?
      <div className="flex justify-end">
        <button
          onClick={deleteBike}
          type="submit"
          className="inline-flex items-center justify-center w-full px-6 py-3 mt-4 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto">
          Yes, I am sure
        </button>
      </div>
    </div>
  );
}

export default DeleteUserModal;
