//#Global Imports
import React from 'react';
import { StarIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import { CalendarIcon } from '@heroicons/react/outline';

//#Local Imports
import BookBikeModal from './BookBikeModal';
import Modal from '../../components/modal';
import { classNames } from '../../utils';

function BikeCard(props) {
  const { bikeData } = props;
  const [isBookModalOpen, setBookModalOpen] = React.useState(false);

  return (
    <>
      <div key={bikeData.id} className="w-full bg-white shadow-sm hover:bg-gray-100">
        <div className="mx-auto overflow-hidden max-w-7xl">
          <div className="relative p-2 border border-gray-200 group">
            <div className="py-4 text-center">
              <h4 className="text-xl font-bold tracking-tight text-gray-600">
                {bikeData.modalName}
              </h4>
              <div className="flex items-center justify-around mt-3">
                <div
                  className="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  style={{ borderColor: bikeData.color }}>
                  <div className="w-4 h-4 rounded-full" style={{ background: bikeData.color }} />
                </div>
                <p className="flex items-center text-base font-medium text-gray-600 capitalize">
                  <LocationMarkerIcon
                    className="flex-shrink-0 w-4 h-4 text-gray-600"
                    aria-hidden="true"
                  />
                  {bikeData.location}
                </p>
              </div>
              <div className="flex items-center justify-center mt-3">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        bikeData.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                        'flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">&nbsp; ({bikeData.rating} Ratings)</p>
              </div>
            </div>

            <div className="px-3 py-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setBookModalOpen(true);
                }}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                <CalendarIcon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-2">Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isModalOpen={isBookModalOpen}
        setIsModalOpen={() => setBookModalOpen(false)}
        isConfirmation={false}>
        <BookBikeModal bikeData={bikeData} handleCloseModal={setBookModalOpen} />
      </Modal>
    </>
  );
}

export default BikeCard;
