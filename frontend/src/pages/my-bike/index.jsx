//#Global Imports
import React from 'react';
import { toast } from 'react-toastify';

//#Local Imports
import db from '../../firebase';
import BikeCard from './BikeCard';
import { UserConfigContext } from '../../context';
import NoRecords from '../../components/noRecord';

const MyBike = () => {
  const { user } = React.useContext(UserConfigContext);
  const [tripData, setTripDate] = React.useState([]);
  const [actionType, setActionType] = React.useState('');
  const [selectedTrip, setSelectedTrip] = React.useState(null);

  const handleCompleteRide = (rate) => {
    db.collection('trips')
      .doc(selectedTrip.id)
      .update({ rating: rate, isRideCompleted: true })
      .then(() => {
        db.collection('trips')
          .where('bid', '==', selectedTrip.bid)
          .where('isRideCompleted', '==', true)
          .onSnapshot((snapshot) => {
            let totalRating = snapshot.docs
              .map((doc) => doc.data().rating)
              .reduce((a, b) => a + b, 0);
            let avgRating = Number((totalRating / snapshot.docs.length).toFixed(2));
            db.collection('bikes')
              .doc(selectedTrip.bid)
              .update({ rating: avgRating })
              .then(() => {
                toast.success('Bike Ride completed successfully.');
                setActionType('');
              })
              .catch(() => {
                toast.error('Something went wrong!, Please try again later');
              });
          });
      })
      .catch(() => {
        toast.error('Something went wrong!, Please try again later');
      });
  };

  const handleDeleteTrip = () => {
    db.collection('trips')
      .doc(selectedTrip.id)
      .delete()
      .then(() => {
        toast.success('Bike ride cancel successfully.');
        setActionType('');
      })
      .catch(() => {
        toast.error('Something went wrong!, Please try again later');
      });
  };

  const fetchBikes = (bike) => {
    return new Promise((resolve) => {
      db.collection('bikes')
        .doc(bike.bid)
        .onSnapshot((doc) => {
          resolve({ ...bike, ...doc.data() });
        });
    });
  };

  React.useEffect(() => {
    db.collection('trips')
      .where('uid', '==', user.uid)
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
            setTripDate(response);
          })
          .catch(() => {
            toast.error('Something went wrong!, Please try again later');
          });
      });
  }, []);

  return (
    <>
      <div className="bg-white">
        <div>
          <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-600">Bikes</h1>
            </div>

            <section aria-labelledby="products-heading" className="pt-6 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
                {/* Bike Card grid */}
                <div className="lg:col-span-6">
                  {tripData?.length === 0 ? (
                    <NoRecords />
                  ) : (
                    <div className="grid grid-cols-2 gap-6 sm:mx-0 md:grid md:grid-cols-3 lg:grid lg:grid-cols-4">
                      {tripData.map((item, index) => {
                        return (
                          <BikeCard
                            key={index}
                            tripData={item}
                            actionType={actionType}
                            setActionType={setActionType}
                            setSelectedTrip={setSelectedTrip}
                            handleDeleteTrip={handleDeleteTrip}
                            handleCompleteRide={handleCompleteRide}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default MyBike;
