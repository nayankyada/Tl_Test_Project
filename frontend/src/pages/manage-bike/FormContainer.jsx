//#Global imports
import React from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

//#Local Imports
import db from '../../firebase';
import { colors, getErrorMessage, location, regexForName } from '../../utils';

const FormContainer = (props) => {
  const { actionType, formData, setFormActionType } = props;
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      isBikeAvailable: actionType === 'edit' ? formData.isBikeAvailable : false
    }
  });

  const onSubmit = (data) => {
    if (actionType === 'add') {
      db.collection('bikes')
        .add({
          modalName: data.modalName,
          color: data.color,
          location: data.location,
          rating: 0,
          isBikeAvailable: data.isBikeAvailable
        })
        .then(() => {
          setFormActionType('');
        })
        .catch((error) => {
          toast.error(error);
        });
    } else if (actionType === 'edit') {
      db.collection('bikes')
        .doc(formData.id)
        .update({
          modalName: data.modalName,
          color: data.color,
          location: data.location,
          isBikeAvailable: data.isBikeAvailable
        })
        .then(() => {
          setFormActionType('');
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-8 m-auto mt-6">
        <div>
          <label htmlFor="modalName" className="block text-sm font-medium text-gray-600">
            Modal Name
          </label>
          <div className="mt-1">
            <input
              id="modalName"
              name="modalName"
              type="text"
              autoComplete="off"
              placeholder="eg. Ducati"
              defaultValue={actionType === 'edit' ? formData.modalName : ''}
              {...register('modalName', {
                required: true,
                pattern: regexForName
              })}
              className={clsx(
                errors.modalName
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                'block w-full px-4 py-3 text-gray-600 rounded-md shadow-sm '
              )}
            />
          </div>
          <p className="text-sm font-semibold text-red-500">
            {getErrorMessage(errors, 'modalName', 'Modal Name')}
          </p>
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-600">
            Color
          </label>
          <div className="mt-1">
            <div className="mt-1">
              <select
                id="color"
                name="color"
                className={clsx(
                  errors.color
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                  'block w-full px-4 py-3 text-gray-500 rounded-md shadow-sm outline-none'
                )}
                defaultValue={actionType === 'edit' ? formData.color : ''}
                {...register('color', {
                  required: true
                })}>
                <option value="">Select Location</option>
                {colors.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.color && (
            <p className="text-sm font-semibold text-red-500">
              {getErrorMessage(errors, 'color', 'Color')}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-600">
            Location
          </label>
          <div className="mt-1">
            <div className="mt-1">
              <select
                id="location"
                name="location"
                className={clsx(
                  errors.location
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                  'block w-full px-4 py-3 text-gray-500 rounded-md shadow-sm outline-none'
                )}
                defaultValue={actionType === 'edit' ? formData.location : ''}
                {...register('location', {
                  required: true
                })}>
                <option value="">Select Location</option>
                {location.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.location && (
            <p className="text-sm font-semibold text-red-500">
              {getErrorMessage(errors, 'location', 'Location')}
            </p>
          )}
        </div>

        <div className="flex items-center justify-start space-x-5">
          <input
            id="isBikeAvailable"
            aria-describedby="is-bike-available"
            name="isBikeAvailable"
            type="checkbox"
            {...register('isBikeAvailable', {})}
            className="w-6 h-6 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="isBikeAvailable" className="block text-sm font-medium text-gray-600">
            Is bike available for rent ?
          </label>
        </div>

        <div className="space-x-3 sm:col-span-2 sm:flex sm:justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center w-full px-6 py-3 mt-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormContainer;
