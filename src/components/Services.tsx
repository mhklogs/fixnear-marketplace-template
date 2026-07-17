import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HardHat, Flame, Droplet, Paintbrush, ArrowUpRight } from 'lucide-react';
import { ServiceType } from '../types';

interface ServicesProps {
  onSelectService: (service: ServiceType) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const servicesList = [
    {
      id: 'roofing' as ServiceType,
      number: '01',
      title: 'Roofing & Envelope Protection',
      description: 'Structural integrity starts from the top. Get matched with certified master elite roofers specializing in architectural asphalt, custom standing-seam metal, and natural slate tile installations built to withstand extreme elements.',
      actionLabel: 'Find Roofing Pros',
      image: 'https://images.unsplash.com/photo-1635424710928-0544e8512eae?auto=format&fit=crop&w=800&q=80',
      icon: HardHat,
      color: 'border-terracotta/30'
    },
    {
      id: 'hvac' as ServiceType,
      number: '02',
      title: 'HVAC & Climate Control Systems',
      description: 'High-efficiency heating, ventilation, and air conditioning configurations. Match with engineering-focused technicians specializing in variable-refrigerant flow (VRF) systems, geothermal heat pumps, and smart home zoning integrations.',
      actionLabel: 'Find HVAC Pros',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      icon: Flame,
      color: 'border-terracotta/30'
    },
    {
      id: 'plumbing' as ServiceType,
      number: '03',
      title: 'Smart Plumbing & Water Infrastructure',
      description: 'Modern, clean, and highly efficient residential water setups. Connect with commercial-grade residential specialists for tankless water heaters, whole-home filtration networks, and complex repiping.',
      actionLabel: 'Find Plumbing Pros',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      icon: Droplet,
      color: 'border-blue-500/30'
    },
    {
      id: 'finishing' as ServiceType,
      number: '04',
      title: 'Custom Finishing (Painting & Drywall)',
      description: 'Flawless interior and exterior surface execution. We partner exclusively with painters and drywall finishing teams who treat walls like architectural canvases—using low-VOC premium paints and Level 5 drywall finishing.',
      actionLabel: 'Find Finishing Pros',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
      icon: Paintbrush,
      color: 'border-emerald-500/30'
    }
  ];

  return (
    <section id="services" className="py-24 sm:py-32 bg-alabaster relative">
      {/* Structural Accent Lines */}
      <div className="absolute top-0 left-1/4 bottom-0 w-[1px] bg-charcoal/5 hidden lg:block" />
      <div className="absolute top-0 left-3/4 bottom-0 w-[1px] bg-charcoal/5 hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-charcoal/15 pb-16 mb-20">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
              // DISCIPLINE OVERVIEW
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-charcoal">
              Core Specialties
            </h2>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <p className="text-lg sm:text-xl text-muted-text font-light leading-relaxed">
              We don't match you with just anyone. We bridge the gap between premium residential properties and vetted, highly specialized craftspeople across four core disciplines.
            </p>
          </div>
        </div>

        {/* Asymmetric Floating Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {servicesList.map((service, index) => {
            const IconComponent = service.icon;
            // Introduce asymmetric margins for the layout grid on desktop to create a dynamic offset feel
            const offsetClass = index % 2 === 1 ? 'md:mt-16' : '';

            return (
              <div
                key={service.id}
                className={`group flex flex-col justify-between bg-white border border-charcoal/10 p-8 sm:p-10 transition-all duration-300 hover:border-terracotta hover:shadow-xl hover:shadow-charcoal/5 ${offsetClass}`}
              >
                <div>
                  {/* Top card metrics / icon */}
                  <div className="flex justify-between items-start mb-10">
                    <span className="font-mono text-4xl font-light text-charcoal/25 tracking-tighter">
                      {service.number}
                    </span>
                    <div className="p-3.5 bg-alabaster text-charcoal group-hover:bg-terracotta group-hover:text-alabaster transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Image with subtle overflow and zoom */}
                  <div className="relative h-64 overflow-hidden mb-8 border border-charcoal/5">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="font-mono text-xs tracking-wider text-alabaster uppercase">
                        Vetted Network Guarantee
                      </span>
                    </div>
                  </div>

                  {/* Title and details */}
                  <h3 className="text-2xl font-display font-bold text-charcoal mb-4 group-hover:text-terracotta transition-colors duration-200">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-text font-light leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>

                {/* Interactive CTA */}
                <button
                  onClick={() => onSelectService(service.id)}
                  className="w-full py-4 border border-charcoal/15 text-charcoal font-mono text-xs tracking-widest uppercase hover:bg-terracotta hover:border-terracotta hover:text-alabaster transition-all duration-300 flex items-center justify-center space-x-2 group-hover:border-terracotta"
                >
                  <span>{service.actionLabel}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Network Status banner */}
        <div className="mt-24 border border-charcoal/10 bg-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="font-display font-bold text-charcoal text-lg">
                Are you an elite, licensed, and insured contractor?
              </h4>
              <p className="text-muted-text text-sm font-light">
                We maintain extremely high standards. Apply to join our exclusive referral marketplace network.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('funnel');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-charcoal hover:bg-terracotta text-alabaster font-mono text-xs tracking-wider px-6 py-4 transition-colors duration-200 whitespace-nowrap"
          >
            JOIN AS CONTRACTOR ↗
          </button>
        </div>

      </div>
    </section>
  );
}
