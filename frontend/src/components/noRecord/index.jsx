import React from 'react';

export default function NoRecords() {
  return (
    <div className="px-16 py-20 text-center bg-slate-50">
      <h2 className="font-semibold text-slate-900">No results found</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        We can’t find anything with that term at the moment, try searching something else.
      </p>
    </div>
  );
}
