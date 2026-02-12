
import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fadeInUp">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fadeInUp [animation-delay:100ms]">Hear from businesses who have transformed their marketing with InfluexKonnect.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="opacity-0 animate-fadeInScale [animation-delay:200ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <TestimonialCard 
              quote="InfluenceConnect helped us find influencers who truly understand our brand. Our sales increased by 45% after our first campaign!" 
              author="Sarah Johnson" 
              role="Marketing Director, FashionBrand" 
              avatarUrl="https://picsum.photos/id/1062/100/100" 
            />
          </div>
          
          <div className="opacity-0 animate-fadeInScale [animation-delay:350ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <TestimonialCard 
              quote="The platform is incredibly easy to use and the results have been outstanding. We've built relationships with influencers who have become true brand ambassadors." 
              author="Michael Chen" 
              role="CEO, TechStartup" 
              avatarUrl="https://picsum.photos/id/1025/100/100" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
export { TestimonialsSection };
