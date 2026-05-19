import React from 'react';

export default function FooterLinks({ t }) {
  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
      <a href="#allergen" className="hover:text-orange">{t.allergen}</a>
      <a href="#contact" className="hover:text-orange">{t.contact}</a>
      <a href="#social" className="hover:text-orange">Social Media</a>
      <a href="#app" className="hover:text-orange">Application</a>
    </div>
  );
}