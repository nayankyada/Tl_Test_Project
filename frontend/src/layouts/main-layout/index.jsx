//#Global Imports
import React from 'react';

//#Local Impoprts
import Header from '../header';
import Footer from '../footer';

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <div className="w-full h-screen">{children}</div>
      <Footer />
    </>
  );
}

export default MainLayout;
