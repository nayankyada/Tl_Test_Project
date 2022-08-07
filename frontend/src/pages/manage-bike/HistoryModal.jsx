//#Global Imports
import React from 'react';
import { StarIcon, LocationMarkerIcon } from '@heroicons/react/solid';

//#Local Imports
import db from '../../firebase';
import { classNames } from '../../utils';
import NoRecords from '../../components/noRecord';

function HistoryModal(props) {
  const { selectedBikeData } = props;
  const [bikeHistory, setBikeHistory] = React.useState([]);

  const fetchUserFromTrip = (trip) => {
    return new Promise((resolve) => {
      db.collection('users')
        .where('uid', '==', trip.uid)
        .onSnapshot((snapshot) => {
          resolve({ ...snapshot.docs[0].data(), ...trip });
        });
    });
  };

  React.useEffect(() => {
    db.collection('trips')
      .where('bid', '==', selectedBikeData.id)
      .where('isRideCompleted', '==', false)
      .onSnapshot((snapshot) => {
        Promise.all(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
            .map((item) => fetchUserFromTrip(item))
        ).then((history) => {
          setBikeHistory(history);
        });
      });
  }, []);

  return (
    <div className="flex flex-col justify-start max-h-[40rem] overflow-y-auto mx-auto space-y-8">
      {bikeHistory.length === 0 ? (
        <NoRecords />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:mx-0 md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
          {bikeHistory.map((items) => {
            return (
              <div key={items.id} className="w-full bg-white shadow-sm hover:bg-gray-100">
                <div className="mx-auto overflow-hidden">
                  <div className="relative p-2 border border-gray-200 group">
                    <div className="py-4 text-center hover:bg-indigo-50">
                      <div className="flex items-center justify-between mx-4 space-x-8">
                        <p className="flex items-center text-base font-medium text-gray-600 capitalize">
                          <span className="text-base font-bold text-black">{items.fullName}</span>
                        </p>
                        <p className="flex items-center text-xs font-medium text-gray-600">
                          {items.email}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mx-4">
                        <h4 className="text-base font-bold tracking-tight text-gray-600">
                          {selectedBikeData.modalName}
                        </h4>
                        <div className="justify-start focus:outline-none">
                          <p className="mt-1 text-sm font-medium text-gray-600">
                            {items.start_date.toDate().toLocaleDateString()} -{' '}
                            {items.end_date.toDate().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mx-4 mt-3">
                        <div
                          className="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                          style={{ borderColor: selectedBikeData.color }}>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: selectedBikeData.color }}
                          />
                        </div>
                        <p className="flex items-center text-base font-medium text-gray-600 capitalize">
                          <LocationMarkerIcon className="flex-shrink-0 w-4 h-4 text-gray-600" />
                          <span className="ml-2 text-base font-bold text-black">
                            {selectedBikeData?.location}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-center mt-3">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                selectedBikeData.rating > rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-200',
                                'flex-shrink-0 h-5 w-5'
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">&nbsp; ({items.rating} Ratings)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryModal;
