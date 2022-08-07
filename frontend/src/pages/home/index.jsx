//#Global Imports
import React from 'react';
import Moment from 'moment';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import { extendMoment } from 'moment-range';
import { Dialog, Disclosure, Transition, Combobox } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { FilterIcon, MinusSmIcon, PlusSmIcon, SearchIcon, StarIcon } from '@heroicons/react/solid';

//#Local Imports
import db from '../../firebase';
import BikeCard from './BikeCard';
import NoRecords from '../../components/noRecord';
import { colors, location } from '../../utils';

const HomePage = () => {
  const moment = extendMoment(Moment);
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = React.useState(null);
  const [filterColor, setFilterColor] = React.useState('');
  const [filterLocation, setFilterLocation] = React.useState('');
  const [filterRating, setFilterRating] = React.useState(0);
  const [filterBikeModal, setFilterBikeModal] = React.useState('');
  const [filteredBikeData, setFilteredBikeData] = React.useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSelectedStartDate(start);
    setSelectedEndDate(end);
  };

  const fetchBikesFromTrip = (bike) => {
    return new Promise((resolve) => {
      db.collection('trips')
        .where('bid', '==', bike.id)
        .where('isRideCompleted', '==', false)
        .onSnapshot((snapshot) => {
          let response = snapshot.docs.map((doc) => {
            let date_range_one = moment.range(
              selectedStartDate.toLocaleDateString(),
              selectedEndDate
                ? selectedEndDate.toLocaleDateString()
                : selectedStartDate.toLocaleDateString()
            );
            let date_range_two = moment.range(
              doc.data().start_date.toDate().toLocaleDateString(),
              doc.data().end_date.toDate().toLocaleDateString()
            );
            return date_range_one.overlaps(date_range_two, { adjacent: true });
          });
          if (response.every((item) => item === false)) {
            resolve(bike);
          } else {
            resolve(null);
          }
        });
    });
  };

  const handleResetFilter = () => {
    setFilterColor('');
    setFilterLocation('');
    setFilterRating(0);
    setFilterBikeModal('');
    setSelectedEndDate(null);
  };

  const fetchBikesData = () => {
    let query = db.collection('bikes');
    query = query.where('isBikeAvailable', '==', true);
    if (filterColor !== 'Select Color' && filterColor !== '') {
      query = query.where('color', '==', filterColor);
    }
    if (filterLocation !== 'Select Location' && filterLocation !== '') {
      query = query.where('location', '==', filterLocation);
    }
    if (filterBikeModal !== 'Select Rating' && Number(filterRating) > 0) {
      query = query.where('rating', '>=', Number(filterRating));
    }
    query.onSnapshot((snapshot) => {
      Promise.all(
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((bike) => bike.modalName?.toLowerCase().includes(filterBikeModal?.toLowerCase()))
          .map((item) => fetchBikesFromTrip(item))
      ).then((response) => {
        setFilteredBikeData(response.filter((item) => item !== null));
      });
    });
  };

  React.useEffect(() => {
    fetchBikesData();
  }, [filterRating, filterColor, filterLocation, selectedStartDate, selectedEndDate]);

  // debouncing on search
  let timer;
  const handleInputChnage = (value) => {
    setFilterBikeModal(value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      window.console.log(value);
      fetchBikesData();
    }, 700);
  };
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <Dialog.Panel className="relative flex flex-col w-full h-full max-w-xs py-4 pb-12 ml-auto overflow-y-auto bg-white shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-600">Filters</h2>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 p-2 -mr-2 text-gray-400 bg-white rounded-md"
                      onClick={() => setMobileFiltersOpen(false)}>
                      <span className="sr-only">Close menu</span>
                      <XIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <Combobox>
                      <div className="relative">
                        <SearchIcon
                          className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          className="w-full h-12 pr-4 text-gray-800 placeholder-gray-400 bg-transparent border-0 pl-11 focus:ring-0 sm:text-sm"
                          placeholder="Search Modal... eg. Ducati"
                          value={filterBikeModal}
                          onChange={(event) => handleInputChnage(event.target.value)}
                        />
                      </div>
                    </Combobox>

                    <Disclosure
                      as="div"
                      key={'colors'}
                      className="px-4 py-6 border-t border-gray-200">
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -mx-2 -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full px-2 py-3 text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-600">Color</span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                  <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {colors.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`filter-color-${optionIdx}`}
                                    name={`color`}
                                    checked={filterColor === option.value}
                                    type="radio"
                                    onClick={() => setFilterColor(option.value)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-color-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>

                    <Disclosure
                      as="div"
                      key="location"
                      className="px-4 py-6 border-t border-gray-200">
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-600">Location</span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                  <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="w-full pt-4">
                              <select
                                id="location"
                                name="location"
                                className={
                                  'w-full block px-4 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm outline-none'
                                }
                                value={filterLocation}
                                onChange={(v) => {
                                  setFilterLocation(v.target.value);
                                }}>
                                <option value="">Select Location</option>
                                {location.map((item, index) => (
                                  <option key={index} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure
                      as="div"
                      key="rating-selection"
                      className="px-4 py-6 border-t border-gray-200">
                      {({ open }) => (
                        <>
                          <h3 className="flow-root -my-3">
                            <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                              <span className="font-medium text-gray-600">Rating</span>
                              <span className="flex items-center ml-6">
                                {open ? (
                                  <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                  <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="flex items-center">
                              {[...Array(5)].map((_items, index) => {
                                return (
                                  <StarIcon
                                    key={index}
                                    className={clsx(
                                      filterRating > index ? 'text-yellow-300' : 'text-gray-400',
                                      'w-7 h-7 cursor-pointer'
                                    )}
                                    aria-hidden="true"
                                    onClick={() => setFilterRating(index + 1)}
                                  />
                                );
                              })}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pt-12 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-600">Bikes</h1>

            <div className="flex items-center">
              <button
                type="button"
                className="p-2 ml-4 -m-2 text-gray-400 sm:ml-6 hover:text-gray-500 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}>
                <span className="sr-only">Filters</span>
                <FilterIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
              {/* Filters */}
              <form className="hidden lg:block">
                <Combobox>
                  <div className="relative">
                    <SearchIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      className="w-full h-12 pr-4 text-gray-800 placeholder-gray-400 bg-transparent border-0 pl-11 focus:ring-0 sm:text-sm"
                      placeholder="Search Modal... eg. Ducati"
                      value={filterBikeModal}
                      onChange={(event) => handleInputChnage(event.target.value)}
                    />
                  </div>
                </Combobox>

                <Disclosure as="div" className="py-6 border-b border-gray-200">
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm capitalize bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-600">Location</span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                            ) : (
                              <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {colors.map((option, optionIdx) => (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`filter-color-${optionIdx}`}
                                name={`color`}
                                checked={filterColor === option.value}
                                type="radio"
                                onClick={() => setFilterColor(option.value)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-color-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" key="location" className="py-6 border-b border-gray-200">
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-600">Location</span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                            ) : (
                              <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="w-full pt-4">
                          <select
                            id="location"
                            name="location"
                            className={
                              'block w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm outline-none'
                            }
                            value={filterLocation}
                            onChange={(v) => {
                              setFilterLocation(v.target.value);
                            }}>
                            <option value="">Select Location</option>
                            {location.map((item, index) => (
                              <option key={index} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" key="rating" className="py-6 border-b border-gray-200">
                  {({ open }) => (
                    <>
                      <h3 className="flow-root -my-3">
                        <Disclosure.Button className="flex items-center justify-between w-full py-3 text-sm text-gray-400 bg-white hover:text-gray-500">
                          <span className="font-medium text-gray-600">Rating</span>
                          <span className="flex items-center ml-6">
                            {open ? (
                              <MinusSmIcon className="w-5 h-5" aria-hidden="true" />
                            ) : (
                              <PlusSmIcon className="w-5 h-5" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="flex items-center">
                          {[...Array(5)].map((_items, index) => {
                            return (
                              <StarIcon
                                key={index}
                                className={clsx(
                                  filterRating > index ? 'text-yellow-300' : 'text-gray-400',
                                  'w-7 h-7 cursor-pointer'
                                )}
                                aria-hidden="true"
                                onClick={() => setFilterRating(index + 1)}
                              />
                            );
                          })}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </form>

              {/* Bike Card grid */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between pb-3 pl-3 text-right">
                  <DatePicker
                    onChange={handleDateChange}
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    minDate={moment().toDate()}
                    selectsRange
                    customInput={
                      <input
                        className="block px-4 py-2 text-gray-500 border border-gray-300 rounded-md shadow-sm outline-none"
                        value={`${selectedStartDate} - ${
                          selectedEndDate ? selectedEndDate : selectedStartDate
                        }`}
                      />
                    }
                  />
                  <div
                    className="w-24 text-base text-indigo-600 cursor-pointer"
                    onClick={handleResetFilter}>
                    Reset filter
                  </div>
                </div>
                {filteredBikeData?.length === 0 ? (
                  <NoRecords />
                ) : (
                  <div className="grid grid-cols-2 gap-4 pl-3 -mx-p sm:mx-0 md:grid md:grid-cols-3 lg:grid lg:grid-cols-3">
                    {filteredBikeData.map((bikeData, index) => (
                      <BikeCard bikeData={bikeData} key={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
