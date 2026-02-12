
import React from 'react';

const StatsSection = () => {
  return (
    <section className="bg-background py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 opacity-0 animate-fadeInUp">Built for Result</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-muted rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Smarter Matching</h3>
            <p className="text-muted-foreground">AI-powered recommendations help you find the right influencers fast.</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full animate-pulse">Coming Soon</span>
          </div>
          
          <div className="bg-muted rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:100ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">All-in-One Dashboard</h3>
            <p className="text-muted-foreground">Handle proposals, chats, and payments without switching tools.</p>
          </div>
          
          <div className="bg-muted rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInScale [animation-delay:200ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">ROI-Driven Analytics</h3>
            <p className="text-muted-foreground">Know what's working with detailed campaign performance insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
export { StatsSection };
