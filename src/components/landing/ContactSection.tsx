
import React from 'react';
import ContactForm from './ContactForm';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="opacity-0 animate-fadeInLeft [animation-delay:200ms]">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 opacity-0 animate-fadeInUp">Get in Touch</h2>
            <p className="text-xl text-muted-foreground mb-8 opacity-0 animate-fadeInUp [animation-delay:100ms]">Have questions about InfluexKonnect? Our team is here to help you find the right solution for your business.</p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 opacity-0 animate-fadeInLeft [animation-delay:300ms] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email Us</h3>
                  <a href="mailto:contact@influenceconnect.com" className="text-primary hover:underline transition-colors duration-300">contact@influenceconnect.com</a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 opacity-0 animate-fadeInLeft [animation-delay:400ms] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 opacity-0 animate-fadeInLeft [animation-delay:500ms] transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Visit Us</h3>
                  <p className="text-muted-foreground">123 Influence Street, Marketing City, 94105</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="opacity-0 animate-fadeInRight [animation-delay:600ms]">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
export { ContactSection };
