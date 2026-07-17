import { Review } from '../types';

const METROS = [
  'Austin, TX', 'Denver, CO', 'Seattle, WA', 'Miami, FL', 'Boston, MA',
  'Chicago, IL', 'Phoenix, AZ', 'Dallas, TX', 'Portland, OR', 'San Diego, CA',
  'Nashville, TN', 'Las Vegas, NV', 'Charlotte, NC', 'Houston, TX', 'Atlanta, GA', 'Orlando, FL',
];

// Reviews are written from the client's perspective (homeowners + commercial
// accounts such as schools and hospitals), since ReferralClose serves customers.
const RAW: Array<[number, number, string, string, string, 'Homeowner' | 'Commercial']> = [
  [1, 5, 'Marcus T.', 'Homeowner · HVAC', 'The AC died in July and I was matched with a certified tech the same afternoon. Fixed in two hours — no cold-calling a single company.', 'Homeowner'],
  [2, 5, 'Sarah K.', 'Homeowner · Painting', 'I requested a few quotes and got one verified painter with great reviews. My living room looks brand new.', 'Homeowner'],
  [3, 4, 'Jason M.', 'Homeowner · Plumbing', 'A plumber was at my house within the hour for a burst pipe. Saved me from a huge mess — only knock was a few too many text updates.', 'Homeowner'],
  [4, 5, 'Amanda L.', 'Homeowner · Deck', 'We wanted a backyard deck and were matched with a local builder who nailed the design. Pay-per-lead, no pushy sales.', 'Homeowner'],
  [5, 5, 'Hector V.', 'Homeowner · Bathroom', 'Two bathroom-remodel quotes, both solid. Picked one and the work was done on time and on budget.', 'Homeowner'],
  [6, 4, 'Brenda S.', 'Homeowner · Landscaping', 'Our yard was a mess. The landscaper they sent designed a low-maintenance garden we actually love.', 'Homeowner'],
  [7, 5, 'Christian B.', 'Homeowner · Roofing', 'Finally a service that didn’t spam me with ten contractors. One verified pro, great roof.', 'Homeowner'],
  [8, 5, 'Rachel W.', 'Homeowner · Flooring', 'ReferralClose matched me with a flooring crew who installed engineered hardwood in a weekend. Flawless.', 'Homeowner'],
  [9, 4, 'Derek H.', 'Homeowner · Electrical', 'Needed panel upgrades and got a licensed electrician quickly. Easy to schedule around my work.', 'Homeowner'],
  [10, 5, 'Frank T.', 'Homeowner · Siding', 'New siding looks fantastic and the crew respected our property. Highly recommend.', 'Homeowner'],
  [11, 3, 'Robert G.', 'Homeowner · Windows', 'Good experience overall, though the first pro was booked solid. The second was great.', 'Homeowner'],
  [12, 5, 'Victor C.', 'Homeowner · Roof', 'High-end slate roof matched perfectly. The intake questions screened out low-budget guys instantly.', 'Homeowner'],
  [13, 5, 'Neil G.', 'Homeowner · HVAC', 'The zip filter was spot on — no driving across town. Comfortable home again.', 'Homeowner'],
  [14, 4, 'Melissa T.', 'Homeowner · Pressure Washing', 'House looks brand new after a wash. Quick, fair, no hassle.', 'Homeowner'],
  [15, 5, 'Peter B.', 'Homeowner · Pool', 'Found a pool pro who handled our resurfacing. Summer saved.', 'Homeowner'],
  [16, 5, 'Gary M.', 'Homeowner · Insulation', 'Attic insulation dropped our energy bill noticeably. Verified pro, clear pricing.', 'Homeowner'],
  [17, 4, 'Teresa L.', 'Homeowner · Kitchen', 'Closed a $42k kitchen reno from a lead here. Worth every penny.', 'Homeowner'],
  [18, 5, 'Dave R.', 'Homeowner · Roofing', 'Unlike random directories, I got a real homeowner-vetted roofer. No robocalls.', 'Homeowner'],
  [19, 5, 'Luis M.', 'Homeowner · Masonry', 'Retaining wall built beautifully. The questionnaire meant no surprises.', 'Homeowner'],
  [20, 4, 'Ken J.', 'Homeowner · Carpentry', 'Trim and built-ins done right. Easy process from request to finish.', 'Homeowner'],
  [21, 5, 'Paul A.', 'Homeowner · Electrical', 'Got an EV charger installed by a certified pro. Clean work.', 'Homeowner'],
  [22, 5, 'Danny F.', 'Homeowner · Remodel', 'First-time homeowner and nervous. ReferralClose made it simple and safe.', 'Homeowner'],

  // Commercial / institutional accounts
  [23, 5, 'Facilities Team', 'Lincoln Elementary School', 'We needed HVAC servicing across 30 classrooms. ReferralClose matched us with a verified commercial contractor who handled the whole campus — teachers and kids stayed comfortable.', 'Commercial'],
  [24, 5, 'Operations', 'St. Mary Regional Hospital', 'Critical cooling went down in a patient wing. Got an emergency commercial tech within the hour — life-safety preserved.', 'Commercial'],
  [25, 4, 'Facilities', 'Riverside High School', 'Gym floor refinishing done over a holiday break by a vetted crew. Safe, on schedule, great finish.', 'Commercial'],
  [26, 5, 'Property Mgmt', 'Maple Court Apartments', 'Multi-unit repipe coordinated smoothly. One verified vendor, transparent pricing across all units.', 'Commercial'],
  [27, 4, 'Kitchen Staff', 'The Harbor Cafe', 'Grease trap and ventilation fixed fast so we could reopen. Local, licensed, reliable.', 'Commercial'],
  [28, 5, 'Administration', 'Grace Community Church', 'Sanctuary roof restored by a trusted crew. The vetting meant no strangers roaming the campus.', 'Commercial'],
];

export const REVIEWS: Review[] = RAW.map(([id, rating, author, context, quote, type], i) => ({
  id,
  rating,
  author,
  type,
  location: METROS[i % METROS.length],
  text: `${quote} — ${author}, ${context}`,
}));
