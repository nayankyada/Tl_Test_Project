//#Global Imports
import React from 'react';
import { toast } from 'react-toastify';
import { StarIcon, LocationMarkerIcon } from '@heroicons/react/solid';

//#Local Imports
import db from '../../firebase';
import { classNames } from '../../utils';
import NoRecords from '../../components/noRecord';

function HistoryModal(props) {
  const { selectedUserData } = props;
  const [userHistory, setUserHistory] = React.useState([]);

  const fetchBikes = (trip) => {
    return new Promise((resolve) => {
      db.collection('bikes')
        .doc(trip.bid)
        .onSnapshot((doc) => {
          resolve({ ...trip, ...doc.data() });
        });
    });
  };

  React.useEffect(() => {
    db.collection('trips')
      .where('uid', '==', selectedUserData.uid)
      .where('isRideCompleted', '==', false)
      .onSnapshot((snapshot) => {
        Promise.all(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
            .map((item) => fetchBikes(item))
        )
          .then((response) => {
            setUserHistory(response);
          })
          .catch(() => {
            toast.error('Something went wrong!, Please try again later');
          });
      });
  }, []);

  return (
    <div className="flex flex-col justify-start max-h-[40rem] overflow-y-auto mx-auto space-y-8">
      {userHistory.length === 0 ? (
        <NoRecords />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:mx-0 md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
          {userHistory.map((item, index) => {
            return (
              <div key={index} className="flex flex-col items-center w-full gap-4 mt-8 mr-4">
                <div className="mx-auto overflow-hidden">
                  <div className="relative border border-gray-200 group">
                    <div className="p-4 text-center hover:bg-indigo-50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold tracking-tight text-gray-600">
                          {item.modalName}
                        </h4>
                        <div className="justify-start focus:outline-none">
                          <p className="mt-1 text-xs font-medium text-gray-600">
                            {item.start_date.toDate().toLocaleDateString()} -{' '}
                            {item.end_date.toDate().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3">
                        <div
                          className="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                          style={{ borderColor: item.color }}>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                        <p className="flex items-center text-base font-medium text-gray-600 capitalize">
                          <LocationMarkerIcon className="flex-shrink-0 w-4 h-4 text-gray-600" />
                          <span className="ml-2 text-base font-bold text-black">
                            {item?.location}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-center mt-3">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                item.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                'flex-shrink-0 h-5 w-5'
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">&nbsp; ({item.rating} Ratings)</p>
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
