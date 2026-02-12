import React from 'react';
import { serviceCategories } from '@/data/services';
import { ServiceType, ServiceCategoryType } from '@/types/service';
import { FileImage, Video, Leaf, DollarSign, MousePointer, Search, BarChart3, TrendingUp, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

interface ServiceCategoriesProps {
  onSelectCategory: (category: ServiceCategoryType) => void;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
  onSelectComingSoonCategory: (category: ServiceCategoryType) => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  FileImage: <FileImage />,
  Video: <Video />,
  Leaf: <Leaf />,
  DollarSign: <DollarSign />,
  MousePointer: <MousePointer />,
  Search: <Search />,
  BarChart3: <BarChart3 />,
  TrendingUp: <TrendingUp />,
  Instagram: <Instagram />,
  Facebook: <Facebook />,
  Youtube: <Youtube />,
  Linkedin: <Linkedin />,
  Twitter: <Twitter />,
};

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  onSelectCategory,
  onSelectService,
  selectedService,
  onSelectComingSoonCategory,
}) => {
  return (
    <div className="p-4">
      {serviceCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 flex items-center gap-2 cursor-pointer text-foreground"
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
            {category.comingSoon && (
              <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">
                Coming Soon
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {category.services.map((service) => (
              <div
                key={service.id}
                onClick={() =>
                  category.comingSoon
                    ? onSelectComingSoonCategory(category)
                    : onSelectService(service)
                }
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id && !category.comingSoon
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-secondary border border-border hover:bg-accent'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl ${
                  selectedService?.id === service.id && !category.comingSoon
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/20 text-primary'
                }`}>
                  {iconMap[service.icon] || service.icon}
                </div>
                <span className="text-sm text-center text-foreground">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategories;
