//#Global Imports
import React, { useContext } from 'react';
import clsx from 'clsx';
import { PlusCircleIcon } from '@heroicons/react/outline';

//#Local Imports
import db from '../../firebase';
import Modal from '../../components/modal';
import FormContainer from './FormContainer';
import HistoryModal from './HistoryModal';
import UserCard from './UserCard';
import DeleteUserModal from './DeleteUserModal';
import { UserConfigContext } from '../../context';
import NoRecords from '../../components/noRecord';

const ManageRole = () => {
  const [fetchedData, setFetchedData] = React.useState([]);
  const [actionType, setActionType] = React.useState('');
  const [switchValue, setSwitchValue] = React.useState('user');
  const [selectedUserData, setSelectedUserData] = React.useState({});
  const { user } = useContext(UserConfigContext);
  const handleAction = (data, mode) => {
    setSelectedUserData(data);
    setActionType(mode);
  };

  React.useEffect(() => {
    setFetchedData([]);
    db.collection('users')
      .where('role', '==', switchValue)
      .onSnapshot((snapshot) => {
        setFetchedData(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      });
  }, [switchValue, user.uid]);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Add and Toggle Button Section */}
        <div className="flex items-center justify-between w-full mb-12">
          <button
            type="button"
            className="flex items-center px-6 py-2 space-x-4 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setActionType('add');
            }}>
            <span>Add {switchValue === 'manager' ? 'Manager' : 'User'}</span>
            <PlusCircleIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          {/* Toggle Button */}
          <div
            className={clsx(
              'relative flex items-center justify-between border rounded-2xl border-blue-600 overflow-hidden w-auto bg-gray-50'
            )}>
            {switchValue === 'manager' ? (
              <button
                type="button"
                className="flex items-center justify-center w-20 p-2 text-base font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2">
                Manager
              </button>
            ) : (
              <div
                className="w-20 p-2 text-base font-medium cursor-pointer"
                onClick={() => {
                  setSwitchValue('manager');
                }}>
                Manager
              </div>
            )}
            {switchValue === 'user' ? (
              <button
                type="button"
                className="flex items-center justify-center w-20 p-2 text-base font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                User
              </button>
            ) : (
              <div
                className="flex justify-center w-20 p-2 text-base font-medium cursor-pointer"
                onClick={() => {
                  setSwitchValue('user');
                }}>
                User
              </div>
            )}
          </div>
        </div>
        {/* Data Listing Section */}
        {fetchedData.length === 0 ? (
          <NoRecords />
        ) : (
          <div className="grid w-full grid-cols-2 gap-8 -mx-px sm:mx-0 md:grid md:grid-cols-3 lg:grid lg:grid-cols-4">
            {fetchedData.map((user, index) => {
              return (
                <UserCard
                  key={index}
                  userData={user}
                  handleAction={handleAction}
                  setSelectedUserData={setSelectedUserData}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add and Edit User/Manager Form Modal Section */}
      <Modal
        isModalOpen={actionType !== ''}
        setIsModalOpen={() => setActionType('')}
        isConfirmation={false}
        width="sm:max-w-lg sm:w-full">
        {actionType === 'history' && <HistoryModal selectedUserData={selectedUserData} />}
        {(actionType === 'edit' || actionType === 'add') && (
          <FormContainer
            actionType={actionType}
            selectedUserData={selectedUserData}
            setActionType={setActionType}
            setSwitchValue={setSwitchValue}
          />
        )}
        {actionType === 'delete' && (
          <DeleteUserModal setActionType={setActionType} selectedUserData={selectedUserData} />
        )}
      </Modal>
    </div>
  );
};

export default ManageRole;
