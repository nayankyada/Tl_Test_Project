//#Global Imports
import React from 'react';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import { toast } from 'react-toastify';
import { extendMoment } from 'moment-range';
import { CalendarIcon, XCircleIcon } from '@heroicons/react/outline';

//#Local Imports
import db from '../../firebase';
import { UserConfigContext } from '../../context';
import { enumerateDaysBetweenDates } from '../../utils';

function BookModal(props) {
  const moment = extendMoment(Moment);
  const { bikeData, handleCloseModal } = props;
  const { user } = React.useContext(UserConfigContext);
  const [tripData, setTripData] = React.useState([]);
  const [tripStartDate, setTripStartDate] = React.useState(new Date());
  const [tripEndDate, setTripEndDate] = React.useState(new Date());
  const [disableBookedBikeDate, setDisableBookedDate] = React.useState([]);
  const [isBookBikeButtonDisable, setBookBikeButtonDisable] = React.useState(true);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setTripStartDate(start);
    setTripEndDate(end);

    let disableStartDate = tripData
      .map((item) => {
        let date_range_one = moment.range(
          start.toLocaleDateString(),
          end ? end.toLocaleDateString() : start.toLocaleDateString()
        );
        let date_range_two = moment.range(
          item.start_date.toDate().toLocaleDateString(),
          item.end_date.toDate().toLocaleDateString()
        );
        return date_range_one.overlaps(date_range_two, { adjacent: true });
      })
      .every((element) => element === false);
    setBookBikeButtonDisable(disableStartDate);
  };

  const handleBookBikeTrip = () => {
    let disableStartDate = tripData
      .map((item) => {
        let date_range_one = moment.range(
          tripStartDate.toLocaleDateString(),
          tripEndDate ? tripEndDate.toLocaleDateString() : tripStartDate.toLocaleDateString()
        );
        let date_range_two = moment.range(
          item.start_date.toDate().toLocaleDateString(),
          item.end_date.toDate().toLocaleDateString()
        );
        return date_range_one.overlaps(date_range_two, { adjacent: true });
      })
      .every((element) => element === false);

    if (disableStartDate) {
      db.collection('trips')
        .add({
          bid: bikeData.id,
          uid: user.uid,
          start_date: tripStartDate,
          end_date: tripEndDate ? tripEndDate : tripStartDate,
          rating: 0,
          isRideCompleted: false
        })
        .then(() => {
          handleCloseModal(false);
          toast.success('Booking Successfully done');
        })
        .catch(() => {
          toast.error('Something went wrong!, Please try again later');
        });
    } else {
      setBookBikeButtonDisable(false);
    }
  };

  React.useEffect(() => {
    db.collection('trips')
      .where('bid', '==', bikeData.id)
      .where('isRideCompleted', '==', false)
      .onSnapshot((snapshot) =>
        setTripData(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      );
  }, []);

  React.useEffect(() => {
    let reservedDate = [];
    tripData.forEach((t) => {
      reservedDate = [
        ...reservedDate,
        ...enumerateDaysBetweenDates(t.start_date.toDate(), t.end_date.toDate())
      ];
    });
    setDisableBookedDate(reservedDate);
  }, [tripData]);

  return (
    <div className="text-center">
      <div className="pb-3">
        {!isBookBikeButtonDisable && (
          <div className="p-4 rounded-md bg-red-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There is 1 errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="pl-5 space-y-1 list-disc">
                    <li>You cant Select in between already Reserved date</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <DatePicker
        inline
        minDate={Moment().toDate()}
        selectsRange
        selected={tripStartDate}
        onChange={handleDateChange}
        startDate={tripStartDate}
        endDate={tripEndDate}
        excludeDates={disableBookedBikeDate?.map((date) => new Date(date))}
      />
      <div className="flex justify-center pt-3">
        <button
          type="submit"
          disabled={!isBookBikeButtonDisable}
          onClick={handleBookBikeTrip}
          className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto">
          <CalendarIcon className="w-5 h-5" aria-hidden="true" />
          <span className="ml-2">Book Now</span>
        </button>
      </div>
    </div>
  );
}

export default BookModal;
