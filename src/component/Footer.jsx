import React from 'react';
import PickupBar from './customer/PickupBar';
import FooterLinks from './FooterLinks';

export default function Footer({ t }) {
  return (
    <footer className="bg-black text-white w-full">

      <FooterLinks t={t} />
    </footer>
  );
}