//#Global imports
import React from 'react';
import { toast } from 'react-toastify';
import db from '../../firebase';

function CancleDeleteBikeModal({ setFormActionType, selectedBikeData }) {
  const deleteBike = () => {
    db.collection('trips')
      .where('bid', '==', selectedBikeData.id)
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
          db.collection('bikes')
            .doc(selectedBikeData.id)
            .delete()
            .then(() => {
              toast.success('Bike deleted');
              setFormActionType('');
            });
        });
      })
      .catch(() => {
        toast.error('No bike found');
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

export default CancleDeleteBikeModal;
