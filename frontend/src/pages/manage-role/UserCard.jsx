//#Global Imports
import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

function UserCard(props) {
  const { userData, handleAction } = props;

  return (
    <div key={userData.id} className="shadow-lg cursor-pointer rounded-xl">
      <div className="max-w-lg mx-auto overflow-hidden rounded-xl">
        <div className="relative">
          <div
            className="p-4 text-center hover:bg-indigo-50"
            onClick={() => {
              handleAction(userData, 'history');
            }}>
            <div className="flex items-center justify-around">
              <h4 className="text-xl font-bold tracking-tight text-gray-600">
                {userData.fullName}
              </h4>
              <p className="flex items-center">
                <span className="ml-2 text-sm font-bold text-gray-600 capitalize">Role:</span>
                <span className="ml-2 text-sm font-bold text-gray-400 capitalize">
                  {userData?.role}
                </span>
              </p>
            </div>
            <span className="ml-2 text-sm font-bold text-gray-400">{userData?.email}</span>
          </div>
          <div className="flex items-center justify-between w-full text-center">
            <button
              type="button"
              className="inline-flex justify-center w-full px-10 py-2 text-base font-medium text-white bg-indigo-500 border border-transparent shadow-sm hover:bg-indigo-800 focus:outline-none sm:w-auto sm:text-sm"
              onClick={() => {
                handleAction(userData, 'edit');
              }}>
              <PencilIcon className="w-5 h-5" aria-hidden="true" />
              <span className="ml-2">Edit</span>
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-10 py-2 text-base font-medium text-white bg-red-500 border border-transparent shadow-sm hover:bg-red-700 sm:w-auto sm:text-sm"
              onClick={() => {
                handleAction(userData, 'delete');
              }}>
              <TrashIcon className="w-5 h-5 cursor" aria-hidden="true" />
              <span className="ml-2">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
