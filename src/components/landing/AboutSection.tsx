
import React from 'react';
import { TrendingUp, Users, Shield, Clock } from 'lucide-react';

interface AboutSectionProps {
  id?: string;
}

const AboutSection = ({
  id
}: AboutSectionProps) => {
  return (
    <section id={id} className="py-20 px-6 bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fadeInUp">About InfluexKonnect</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fadeInUp [animation-delay:100ms]">
            We're on a mission to revolutionize influencer marketing by making it accessible, 
            transparent, and effective for businesses of all sizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <div className="opacity-0 animate-fadeInLeft [animation-delay:200ms]">
            <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">InfluexKonnect was born out of frustration with the traditional influencer marketing landscape. Our founders, having worked with brands of all sizes, saw a need for a platform that removed the barriers to effective influencer partnerships.</p>
            <p className="text-muted-foreground mb-4">
              What started as a simple matchmaking service has evolved into a comprehensive platform that handles 
              every aspect of the influencer marketing process, from discovery to reporting.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to serve thousands of businesses and connect them with our community of vetted 
              influencers who are passionate about creating authentic content that drives results.
            </p>
          </div>
          <div className="opacity-0 animate-fadeInRight [animation-delay:300ms]">
            <img src="https://picsum.photos/id/1045/800/600" alt="Team collaboration" className="rounded-xl shadow-lg w-full transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-card rounded-xl p-8 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:400ms]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
            <p className="text-muted-foreground">Our platform helps brands achieve growth through strategic, measurable influencer collaborations.</p>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:500ms]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
            <p className="text-muted-foreground">Get expert guidance from our marketing team at every stage—from strategy to execution.</p>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:600ms]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Trusted Platform</h3>
            <p className="text-muted-foreground">Every influencer is vetted for authenticity, quality, and audience engagement.</p>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-sm text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:700ms]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Time Efficient</h3>
            <p className="text-muted-foreground">
              Our streamlined process saves you time, allowing you to focus on your core business while we handle the details.
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-10 shadow-sm opacity-0 animate-fadeInUp [animation-delay:800ms]">
          <h3 className="text-2xl font-semibold mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative opacity-0 animate-fadeInUp [animation-delay:900ms]">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 transition-transform duration-300 hover:scale-110">1</div>
              <h4 className="text-lg font-medium mb-2">Sign Up & Define Your Needs</h4>
              <p className="text-muted-foreground">
                Create an account, select your industry, and define your campaign goals and requirements.
              </p>
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-1 bg-primary/30"></div>
            </div>
            
            <div className="relative opacity-0 animate-fadeInUp [animation-delay:1000ms]">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 transition-transform duration-300 hover:scale-110">2</div>
              <h4 className="text-lg font-medium mb-2">Browse & Connect With Influencers</h4>
              <p className="text-muted-foreground">
                Search our database of influencers, filter by niche, audience demographics, and platform.
              </p>
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-1 bg-primary/30"></div>
            </div>
            
            <div className="opacity-0 animate-fadeInUp [animation-delay:1100ms]">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4 transition-transform duration-300 hover:scale-110">3</div>
              <h4 className="text-lg font-medium mb-2">Manage Campaigns & Track Results</h4>
              <p className="text-muted-foreground">
                Approve content, monitor campaign progress, and measure performance with our analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
export { AboutSection };
