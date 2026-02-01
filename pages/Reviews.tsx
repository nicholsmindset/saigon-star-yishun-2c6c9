import React from 'react';
import { BUSINESS_CONFIG } from '../config/business';

// Sample reviews - Replace with real reviews from Google My Business
const GOOGLE_REVIEWS = [
  {
    id: 1,
    author: 'Sarah T.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Absolutely amazing service! The nail art is so detailed and beautiful. I get so many compliments. The staff are friendly and professional. Highly recommend!',
    verified: true
  },
  {
    id: 2,
    author: 'Michelle L.',
    rating: 5,
    date: '1 month ago',
    text: 'Best lash extensions I\'ve ever had! They last so long and look so natural. The technician was very gentle and professional. Will definitely be back!',
    verified: true
  },
  {
    id: 3,
    author: 'Jessica Wong',
    rating: 5,
    date: '3 weeks ago',
    text: 'The YY lashes are incredible! My lashes have never looked better. The retention is amazing - still going strong after 4 weeks. Worth every penny!',
    verified: true
  },
  {
    id: 4,
    author: 'Amanda K.',
    rating: 5,
    date: '2 months ago',
    text: 'Such a hidden gem in Yishun! The nail art is so intricate and the gel lasts forever. Clean, professional, and the staff are so talented. Love this place!',
    verified: true
  },
  {
    id: 5,
    author: 'Rachel Tan',
    rating: 5,
    date: '1 week ago',
    text: 'I\'ve been going here for over a year and never disappointed. The quality is always top-notch. Best nail salon in Yishun by far!',
    verified: true
  },
  {
    id: 6,
    author: 'Lisa Chen',
    rating: 5,
    date: '3 weeks ago',
    text: 'Amazing experience! The spa pedicure was so relaxing and my feet have never looked better. The attention to detail is incredible. Definitely my new go-to salon!',
    verified: true
  },
  {
    id: 7,
    author: 'Emily N.',
    rating: 5,
    date: '1 month ago',
    text: 'The manga lashes are AMAZING! So unique and exactly what I wanted. The technician was so skilled and patient. Highly recommend for anyone looking for something different!',
    verified: true
  },
  {
    id: 8,
    author: 'Karen Lim',
    rating: 5,
    date: '2 weeks ago',
    text: 'Best gel manicure ever! The Korean gels they use are so gentle on my nails. No damage, just healthy, beautiful nails. Love the color selection too!',
    verified: true
  },
];

const REVIEW_STATS = {
  totalReviews: '800+',
  averageRating: 4.9,
  fiveStars: 785,
  fourStars: 12,
  threeStars: 2,
  twoStars: 1,
  oneStar: 0,
};

const Reviews: React.FC = () => {
  return (
    <div className="bg-brand-nude pt-24 sm:pt-32 pb-12 sm:pb-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-20">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 sm:mb-4 block">
            Social Proof
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-dark mb-4 sm:mb-6">What Our Clients Say</h1>
          <p className="text-brand-dark/60 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Join {REVIEW_STATS.totalReviews} happy clients who trust Saigon Star for their beauty needs
          </p>
        </header>

        {/* Review Stats */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <div className="bg-white p-6 sm:p-12 shadow-2xl border border-brand-accent/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              {/* Overall Rating */}
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-3 justify-center md:justify-start">
                  <span className="text-5xl sm:text-6xl font-bold text-brand-dark">
                    {REVIEW_STATS.averageRating}
                  </span>
                  <span className="text-xl sm:text-2xl text-brand-dark/40">/ 5.0</span>
                </div>
                <div className="flex gap-1 mb-3 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-brand-dark/60">
                  Based on <span className="font-bold text-brand-gold">{REVIEW_STATS.totalReviews}</span> reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 w-full max-w-md">
                {[
                  { stars: 5, count: REVIEW_STATS.fiveStars },
                  { stars: 4, count: REVIEW_STATS.fourStars },
                  { stars: 3, count: REVIEW_STATS.threeStars },
                  { stars: 2, count: REVIEW_STATS.twoStars },
                  { stars: 1, count: REVIEW_STATS.oneStar },
                ].map((item) => {
                  const percentage = (item.count / 800) * 100;
                  return (
                    <div key={item.stars} className="flex items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-xs font-bold text-brand-dark w-8">{item.stars} &#9733;</span>
                      <div className="flex-1 h-2 bg-brand-blush rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-gold transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-brand-dark/40 w-10 sm:w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Reviews Link */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-brand-accent/20 text-center">
              <a
                href="https://www.google.com/search?q=saigon+star+yishun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-brand-dark text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors w-full sm:w-auto"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Read All Reviews on Google
              </a>
            </div>
          </div>
        </div>

        {/* Featured Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-12 sm:mb-16">
          {GOOGLE_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 sm:p-8 shadow-lg border border-brand-accent/10 hover-lift"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-brand-gold fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-brand-dark/70 leading-relaxed mb-4 sm:mb-6 text-sm">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-brand-accent/20">
                <div>
                  <p className="font-bold text-sm text-brand-dark">{review.author}</p>
                  <p className="text-xs text-brand-dark/40">{review.date}</p>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-brand-gold text-xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="uppercase tracking-wider font-bold">Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white p-6 sm:p-12 shadow-2xl text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif text-brand-dark mb-4 sm:mb-6">
            Experience the Saigon Star Difference
          </h2>
          <p className="text-brand-dark/60 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            Join hundreds of satisfied clients who trust us for premium nail and lash services.
            Book your appointment today and see why we're Yishun's top-rated beauty salon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/#/booking"
              className="bg-brand-gold text-white px-8 sm:px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-colors text-center"
            >
              Book Your Appointment
            </a>
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 sm:px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-green-600 transition-colors text-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {[
            { label: '800+', subtitle: 'Happy Clients' },
            { label: '4.9\u2605', subtitle: 'Average Rating' },
            { label: '6+', subtitle: 'Years Experience' },
            { label: '98%', subtitle: 'Return Rate' },
          ].map((badge, i) => (
            <div key={i} className="text-center p-4 sm:p-6 bg-white shadow-lg">
              <p className="text-2xl sm:text-3xl font-bold text-brand-gold mb-1 sm:mb-2">{badge.label}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-dark/60">
                {badge.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
