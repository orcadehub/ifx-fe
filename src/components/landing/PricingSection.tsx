
import React from 'react';
import PricingCard from './PricingCard';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-6 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fadeInUp">Transparent Pricing Plans</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fadeInUp [animation-delay:100ms]">
            Choose the plan that fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="opacity-0 animate-fadeInScale [animation-delay:200ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
            <PricingCard 
              title="Basic"
              price="$49"
              period="per month"
              description="Perfect for small businesses just getting started with influencer marketing."
              features={[
                "Access to 1,000+ influencers",
                "5 campaign requests per month",
                "Basic analytics",
                "Email support"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
          </div>
          
          <div className="opacity-0 animate-fadeInScale [animation-delay:300ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
            <PricingCard 
              title="Pro"
              price="$99"
              period="per month"
              description="Ideal for growing businesses ready to scale their influencer marketing."
              features={[
                "Access to 5,000+ influencers",
                "20 campaign requests per month",
                "Advanced analytics",
                "Priority email support",
                "Campaign management tools"
              ]}
              buttonText="Get Started"
              buttonVariant="default"
              highlighted={true}
            />
          </div>
          
          <div className="opacity-0 animate-fadeInScale [animation-delay:400ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
            <PricingCard 
              title="Advanced"
              price="$199"
              period="per month"
              description="For established businesses with serious influencer marketing needs."
              features={[
                "Access to all influencers",
                "Unlimited campaign requests",
                "Comprehensive analytics",
                "24/7 phone support",
                "Dedicated account manager",
                "Custom reporting"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
          </div>
          
          <div className="opacity-0 animate-fadeInScale [animation-delay:500ms] transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
            <PricingCard 
              title="Custom"
              price="Contact Us"
              period=""
              description="Tailored solutions for enterprise clients with specific requirements."
              features={[
                "Custom influencer selection",
                "Bespoke campaign strategies",
                "White-label options",
                "API access",
                "Multi-user accounts",
                "Enterprise-level support"
              ]}
              buttonText="Contact Sales"
              buttonVariant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
export { PricingSection };
