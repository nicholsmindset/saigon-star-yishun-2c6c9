
import React, { useState } from 'react';
import { SERVICES, TEAM } from '../constants';

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    staff: '',
    date: '',
    time: '',
    name: '',
    phone: ''
  });

  const handleBooking = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-brand-dark mb-8 text-center">Select Your Experience</h3>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto px-2">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => { handleBooking('service', s.name); nextStep(); }}
                  className={`p-6 border text-left transition-all ${bookingData.service === s.name ? 'border-brand-gold bg-brand-blush/20' : 'border-brand-accent/30 hover:border-brand-gold'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-widest">{s.name}</span>
                    <span className="text-brand-gold font-bold">{s.price}</span>
                  </div>
                  <p className="text-[10px] text-brand-dark/40 mt-1">{s.duration}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-brand-dark mb-8 text-center">Choose Artist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => { handleBooking('staff', 'Any Artist'); nextStep(); }}
                className={`p-6 border text-center transition-all ${bookingData.staff === 'Any Artist' ? 'border-brand-gold bg-brand-blush/20' : 'border-brand-accent/30 hover:border-brand-gold'}`}
              >
                <div className="w-12 h-12 bg-brand-blush rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xs">A</div>
                <span className="font-bold text-xs uppercase tracking-widest">First Available</span>
              </button>
              {TEAM.map(t => (
                <button
                  key={t.id}
                  onClick={() => { handleBooking('staff', t.name); nextStep(); }}
                  className={`p-6 border text-center transition-all ${bookingData.staff === t.name ? 'border-brand-gold bg-brand-blush/20' : 'border-brand-accent/30 hover:border-brand-gold'}`}
                >
                  <img src={t.image} className="w-12 h-12 rounded-full mx-auto mb-3 object-cover" />
                  <span className="font-bold text-xs uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
            </div>
            <button onClick={prevStep} className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mx-auto pt-4 underline">Back to Services</button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-brand-dark mb-8 text-center">Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 mb-4 block">Select Date</label>
                <input 
                  type="date" 
                  className="w-full border border-brand-accent/30 p-4 text-sm outline-none focus:border-brand-gold"
                  onChange={(e) => handleBooking('date', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-dark/40 mb-4 block">Preferred Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {['11:00', '12:30', '14:00', '15:30', '17:00', '18:30'].map(t => (
                    <button
                      key={t}
                      onClick={() => handleBooking('time', t)}
                      className={`p-2 border text-[10px] font-bold ${bookingData.time === t ? 'bg-brand-gold text-white' : 'border-brand-accent/30'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              disabled={!bookingData.date || !bookingData.time}
              onClick={nextStep}
              className="w-full bg-brand-dark text-white py-4 text-[10px] uppercase tracking-widest font-bold mt-8 disabled:opacity-20"
            >
              Continue
            </button>
            <button onClick={prevStep} className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mx-auto underline">Back to Staff</button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-brand-dark mb-8 text-center">Almost Done</h3>
            <div className="bg-brand-blush/20 p-6 mb-8">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-4">Your Summary</p>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span>Service:</span> <span className="font-bold">{bookingData.service}</span></p>
                <p className="flex justify-between"><span>Artist:</span> <span className="font-bold">{bookingData.staff}</span></p>
                <p className="flex justify-between"><span>When:</span> <span className="font-bold">{bookingData.date} @ {bookingData.time}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Full Name" 
                className="w-full border-b border-brand-accent/40 py-3 text-sm outline-none focus:border-brand-gold bg-transparent"
                onChange={(e) => handleBooking('name', e.target.value)}
              />
              <input 
                type="tel" 
                placeholder="Singapore Mobile Number" 
                className="w-full border-b border-brand-accent/40 py-3 text-sm outline-none focus:border-brand-gold bg-transparent"
                onChange={(e) => handleBooking('phone', e.target.value)}
              />
            </div>
            <button 
              className="w-full bg-brand-gold text-white py-5 text-[10px] uppercase tracking-[0.2em] font-bold mt-8"
              onClick={() => alert("Booking Sent! We will contact you shortly to confirm.")}
            >
              Confirm Appointment
            </button>
            <button onClick={prevStep} className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mx-auto underline">Edit Details</button>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-nude pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-brand-gold transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">Online Concierge</h2>
            <span className="text-[10px] text-brand-dark/30 font-bold uppercase tracking-widest">Step {step} / 4</span>
          </div>

          {renderStep()}
        </div>

        <div className="mt-12 text-center text-brand-dark/40 text-[10px] uppercase tracking-widest font-bold">
           Need help booking? Call us at <span className="text-brand-dark">+65 8888 1234</span>
        </div>
      </div>
    </div>
  );
};

export default Booking;
