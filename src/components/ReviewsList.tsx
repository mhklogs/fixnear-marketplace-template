import React, { useState, useMemo } from 'react';
import { Star, Search, Filter, SlidersHorizontal, ArrowLeft, ArrowRight, UserCheck, HardHat } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import { Review } from '../types';

export default function ReviewsList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Homeowner' | 'Commercial'>('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Stats calculation
  const stats = useMemo(() => {
    const total = REVIEWS.length;
    let sum = 0;
    let count5 = 0;
    let count4 = 0;
    let count3 = 0;
    let countHomeowners = 0;
    let countCommercial = 0;

    REVIEWS.forEach(r => {
      sum += r.rating;
      if (r.rating === 5) count5++;
      else if (r.rating === 4) count4++;
      else if (r.rating === 3) count3++;

      if (r.type === 'Homeowner') countHomeowners++;
      else if (r.type === 'Commercial') countCommercial++;
    });

    const average = sum / total;

    return {
      total,
      average: average.toFixed(1),
      count5,
      count4,
      count3,
      countHomeowners,
      countCommercial,
      pct5: ((count5 / total) * 100).toFixed(0),
      pct4: ((count4 / total) * 100).toFixed(0),
      pct3: ((count3 / total) * 100).toFixed(0),
    };
  }, []);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    let result = [...REVIEWS];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.author.toLowerCase().includes(q) || 
        r.location.toLowerCase().includes(q) || 
        r.text.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'All') {
      result = result.filter(r => r.type === typeFilter);
    }

    // Rating filter
    if (ratingFilter !== 'All') {
      result = result.filter(r => r.rating === ratingFilter);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortOrder === 'high') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

    return result;
  }, [search, typeFilter, ratingFilter, sortOrder]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage) || 1;
  const currentReviews = useMemo(() => {
    // Safety check current page
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * reviewsPerPage;
    return filteredReviews.slice(start, start + reviewsPerPage);
  }, [filteredReviews, currentPage, totalPages]);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    // Smooth scroll to reviews header so page change is obvious
    const header = document.getElementById('reviews-header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-alabaster relative border-b border-charcoal/10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div id="reviews-header" className="max-w-3xl mb-16">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
            // SATISFACTION INDEX
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-charcoal">
            Verified Homeowner & Commercial Reviews
          </h2>
          <p className="text-muted-text font-light mt-2 leading-relaxed">
            Real feedback from the customers we serve — homeowners and commercial accounts like schools and hospitals — after their projects were matched and completed through our network.
          </p>
        </div>

        {/* Dashboard Visual Summary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Average Rating Scorecard */}
          <div className="lg:col-span-4 bg-white border border-charcoal/10 p-8 flex flex-col justify-between text-center">
            <div>
              <span className="font-mono text-xs text-muted-text uppercase tracking-widest block mb-4">
                Global Performance Score
              </span>
              <div className="text-6xl sm:text-7xl font-display font-black text-charcoal tracking-tighter">
                {stats.average}
              </div>
              <div className="flex justify-center my-3 text-terracotta">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="border-t border-charcoal/10 pt-4 mt-6">
              <span className="font-mono text-xs text-muted-text">
                Based on <strong className="text-charcoal font-semibold">{stats.total} verified reviews</strong>
              </span>
            </div>
          </div>

          {/* Stars Distribution Bar Charts */}
          <div className="lg:col-span-5 bg-white border border-charcoal/10 p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-muted-text uppercase tracking-widest block mb-6">
                Score Dispersion Breakdown
              </span>
              
              <div className="space-y-4 font-mono text-xs">
                {/* 5 Stars */}
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-charcoal font-bold">5 STARS</span>
                  <div className="flex-grow h-3 bg-alabaster border border-charcoal/5 rounded-full overflow-hidden">
                    <div className="h-full bg-terracotta" style={{ width: `${stats.pct5}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-text font-semibold">{stats.pct5}%</span>
                </div>

                {/* 4 Stars */}
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-charcoal font-bold">4 STARS</span>
                  <div className="flex-grow h-3 bg-alabaster border border-charcoal/5 rounded-full overflow-hidden">
                    <div className="h-full bg-charcoal" style={{ width: `${stats.pct4}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-text font-semibold">{stats.pct4}%</span>
                </div>

                {/* 3 Stars */}
                <div className="flex items-center space-x-3">
                  <span className="w-12 text-charcoal font-bold">3 STARS</span>
                  <div className="flex-grow h-3 bg-alabaster border border-charcoal/5 rounded-full overflow-hidden">
                    <div className="h-full bg-charcoal/40" style={{ width: `${stats.pct3}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-text font-semibold">{stats.pct3}%</span>
                </div>
              </div>
            </div>

            <span className="text-[10px] text-muted-text font-mono mt-6">
              * Independent security matching score verified via SMS ping feedback.
            </span>
          </div>

          {/* Network Contributors */}
          <div className="lg:col-span-3 bg-white border border-charcoal/10 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-xs text-muted-text uppercase tracking-widest block">
                Network Participants
              </span>
              
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-charcoal/5 pb-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-terracotta" />
                    <span className="text-sm font-medium text-charcoal">Homeowners</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-charcoal">{stats.countHomeowners}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <HardHat className="w-4 h-4 text-charcoal" />
                    <span className="text-sm font-medium text-charcoal">Commercial</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-charcoal">{stats.countCommercial}</span>
                </div>
              </div>
            </div>

            <div className="bg-alabaster p-4 border border-charcoal/5 text-xs text-muted-text font-light leading-relaxed">
              Matched clients are requested to rate their trade professional within 10 days of project wrap-up.
            </div>
          </div>

        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white border border-charcoal/10 p-6 sm:p-8 mb-10 flex flex-col lg:flex-row justify-between items-stretch gap-6">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
            <input
              type="text"
              placeholder="Search by name, location, content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-alabaster border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Quick Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            
            {/* Type selector */}
            <div className="flex items-center space-x-2">
              <span className="text-muted-text uppercase tracking-wider">TYPE:</span>
              <div className="inline-flex border border-charcoal/10 bg-alabaster">
                {(['All', 'Homeowner', 'Commercial'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 border-r last:border-r-0 border-charcoal/10 transition-colors ${
                      typeFilter === t ? 'bg-charcoal text-alabaster font-bold' : 'hover:bg-charcoal/5 text-charcoal'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-muted-text uppercase tracking-wider">RATING:</span>
              <div className="inline-flex border border-charcoal/10 bg-alabaster">
                {(['All', 5, 4, 3] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRatingFilter(r);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 border-r last:border-r-0 border-charcoal/10 transition-colors ${
                      ratingFilter === r ? 'bg-charcoal text-alabaster font-bold' : 'hover:bg-charcoal/5 text-charcoal'
                    }`}
                  >
                    {r === 'All' ? 'ALL' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorter */}
            <div className="flex items-center space-x-2">
              <span className="text-muted-text uppercase tracking-wider">SORT:</span>
              <button
                onClick={() => {
                  setSortOrder(p => p === 'high' ? 'low' : 'high');
                  setCurrentPage(1);
                }}
                className="border border-charcoal/10 bg-alabaster px-3 py-1.5 text-charcoal hover:bg-charcoal/5 font-bold uppercase"
              >
                {sortOrder === 'high' ? 'HIGH ➔ LOW' : 'LOW ➔ HIGH'}
              </button>
            </div>

          </div>

        </div>

        {/* Reviews List Dynamic Grid */}
        {currentReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white border border-charcoal/10 p-8 flex flex-col justify-between transition-all duration-300 hover:border-terracotta hover:shadow-lg"
              >
                <div>
                  {/* Rating Stars & Author Info */}
                  <div className="flex justify-between items-start border-b border-charcoal/5 pb-4 mb-5">
                    <div>
                      <div className="flex text-terracotta mb-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-4 h-4 ${idx < review.rating ? 'fill-current' : 'text-charcoal/10'}`} 
                          />
                        ))}
                      </div>
                      <h4 className="font-display font-bold text-charcoal text-base">
                        {review.author}
                      </h4>
                    </div>
                    
                    {/* Badge type */}
                    <span className={`px-2.5 py-1 font-mono text-[9px] tracking-widest uppercase border ${
                      review.type === 'Homeowner' 
                        ? 'bg-alabaster text-muted-text border-charcoal/10' 
                        : 'bg-terracotta/10 text-terracotta border-terracotta/20 font-bold'
                    }`}>
                      {review.type}
                    </span>
                  </div>

                  {/* Text Description */}
                  <p className="text-charcoal/80 font-light text-sm leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Bottom metadata */}
                <div className="font-mono text-[10px] tracking-wider text-muted-text flex justify-between border-t border-charcoal/5 pt-4">
                  <span>METRO: {review.location.toUpperCase()}</span>
                  <span>ID: #{1000 + review.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white border border-charcoal/10 p-16 text-center">
            <SlidersHorizontal className="w-12 h-12 text-muted-text/30 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-charcoal">
              No results found
            </h3>
            <p className="text-muted-text font-light text-sm mt-1">
              Try adjusting your search queries or resetting filters.
            </p>
          </div>
        )}

        {/* Paginated Controller Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-between items-center border-t border-charcoal/10 pt-8 font-mono text-xs">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center space-x-2 text-charcoal hover:text-terracotta disabled:opacity-35 disabled:hover:text-charcoal transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            <div className="hidden sm:flex space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isCurrent = currentPage === p;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 font-bold border transition-colors ${
                      isCurrent 
                        ? 'bg-charcoal text-alabaster border-charcoal' 
                        : 'bg-white border-charcoal/10 text-charcoal hover:bg-alabaster'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <span className="sm:hidden text-muted-text font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center space-x-2 text-charcoal hover:text-terracotta disabled:opacity-35 disabled:hover:text-charcoal transition-colors disabled:cursor-not-allowed"
            >
              <span>NEXT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
