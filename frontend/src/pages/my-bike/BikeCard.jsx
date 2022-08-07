//#Global Imports
import React from 'react';
import { StarIcon, LocationMarkerIcon } from '@heroicons/react/solid';

//#Local Imports
import { classNames } from '../../utils';
import Modal from '../../components/modal';
import CancelRideModal from './CancelRideModal';
import CompleteRideModal from './CompleteRideModal';

function BikeCard(props) {
  const {
    tripData,
    actionType,
    setActionType,
    handleCompleteRide,
    handleDeleteTrip,
    setSelectedTrip
  } = props;

  return (
    <>
      <div
        key={tripData.id}
        className="w-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100">
        <div className="max-w-md mx-auto overflow-hidden">
          <div className="relative p-2 group">
            <div className="py-4 text-center">
              <div className="flex items-center justify-around">
                <h4 className="text-xl font-bold tracking-tight text-gray-600">
                  {tripData.modalName}
                </h4>
                <div className="justify-start focus:outline-none">
                  <p className="text-sm font-medium text-gray-600">
                    <span>
                      <strong>Booking: </strong>
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {tripData.start_date.toDate().toLocaleDateString()} -{' '}
                    {tripData.end_date.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-around mt-3">
                <div
                  className="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  style={{ borderColor: tripData.color }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: tripData.color }} />
                </div>
                <p className="flex items-center text-base font-medium text-gray-600 capitalize">
                  <LocationMarkerIcon
                    className="flex-shrink-0 w-4 h-4 text-gray-600"
                    aria-hidden="true"
                  />
                  {tripData.location}
                </p>
              </div>

              <div className="flex items-center justify-center mt-3">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        tripData.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                        'flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">&nbsp; ({tripData.rating} Ratings)</p>
              </div>
            </div>

            <div className="flex justify-center px-3 py-2 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  setActionType('complete_ride');
                  setSelectedTrip(tripData);
                }}>
                Done
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  setActionType('cancel_ride');
                  setSelectedTrip(tripData);
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isModalOpen={actionType !== ''}
        setIsModalOpen={() => setActionType('')}
        isConfirmation={false}>
        {actionType === 'cancel_ride' && <CancelRideModal handleDeleteTrip={handleDeleteTrip} />}
        {actionType === 'complete_ride' && (
          <CompleteRideModal handleCompleteRide={handleCompleteRide} />
        )}
      </Modal>
    </>
  );
}

export default BikeCard;
