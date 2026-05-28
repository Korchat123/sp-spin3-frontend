import React, { useState, useCallback } from 'react';
import BranchSelector from '../../component/customer/BranchSelector';
import SummaryInform from '../../component/customer/SummaryInform';
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const navigate = useNavigate();

  const [orderState, setOrderState] = useState({
    type: 'Booking',
    branch: null,
    date: new Date().toISOString().split('T')[0],
    time: '13:00-15:00',
    member: '5P',
    userAddress: '', 
  });

  const [profile, setProfile] = useState({
    name: 'MR. PERSESS',
    email: 'test@gmail.com',
    contact: '+66 258423381123'
  });

  // Handle branch selection
  const handleSelectBranch = useCallback((branchName) => {
    setOrderState(prev => ({ ...prev, branch: branchName }));
  }, []);

  // Handle address update
  const handleUpdateAddress = useCallback((address) => {
    setOrderState(prev => ({ ...prev, userAddress: address }));
  }, []);

  // Navigate to payment with all required data
  const goToCheckout = useCallback(() => {
    navigate("/payment", {
      state: { 
        bookingDate: orderState.date,
        bookingTime: orderState.time,
        branch: orderState.branch,
        member: orderState.member,
        userAddress: orderState.userAddress,
        profile: profile,
      } 
    });
  }, [orderState, profile, navigate]);

  return (
    <div className="bg-brand-gray text-brand-black font-sans-thai pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto pt-10 px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <BranchSelector 
          onSelectBranch={handleSelectBranch} 
          onUpdateAddress={handleUpdateAddress}
        />
        <SummaryInform
          orderState={orderState} 
          setOrderState={setOrderState} 
          profile={profile} 
          setProfile={setProfile} 
          onConfirm={goToCheckout}
        />
      </div>
    </div>
  );
}