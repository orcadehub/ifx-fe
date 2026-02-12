import { ServiceCategoryType, ServiceType } from '@/types/service';

export const services: ServiceType[] = [
  // Designers Category
  { id: '1', name: 'Posts', icon: 'FileImage', category: 'designers' },
  { id: '2', name: 'Reels/Shorts', icon: 'Video', category: 'designers' },
  { id: '3', name: 'Logo Design', icon: 'Leaf', category: 'designers' },
  { id: '4', name: 'Logo Animation', icon: 'DollarSign', category: 'designers' },
  
  // Marketing Category
  { id: '5', name: 'Pay per click', icon: 'MousePointer', category: 'marketing' },
  { id: '6', name: 'SEO Ranking', icon: 'Search', category: 'marketing' },
  { id: '7', name: 'Google Analytics', icon: 'BarChart3', category: 'marketing' },
  { id: '8', name: 'Google Business', icon: 'TrendingUp', category: 'marketing' },
  
  // Social Media Category
  { id: '9', name: 'Google Ads', icon: 'Search', category: 'social' },
  { id: '10', name: 'Instagram', icon: 'Instagram', category: 'social' },
  { id: '11', name: 'Facebook', icon: 'Facebook', category: 'social' },
  { id: '12', name: 'Youtube', icon: 'Youtube', category: 'social' },
  { id: '13', name: 'LinkedIn', icon: 'Linkedin', category: 'social' },
  { id: '14', name: 'Pinterest', icon: 'FileImage', category: 'social' },
  { id: '15', name: 'Snapchat', icon: 'Video', category: 'social' },
  { id: '16', name: 'Twitter', icon: 'Twitter', category: 'social' },
  
  // OTT Category
  { id: '17', name: 'Hotstar', icon: 'Video', category: 'ott' },
  { id: '18', name: 'Amazon', icon: 'Video', category: 'ott' },
  { id: '19', name: 'Jio', icon: 'Video', category: 'ott' },
  { id: '20', name: 'Zee5', icon: 'Video', category: 'ott' },
];

export const serviceCategories: ServiceCategoryType[] = [
  {
    id: 'designers',
    name: 'Design Services',
    services: services.filter(service => service.category === 'designers')
  },
  {
    id: 'marketing',
    name: 'Marketing Services',
    services: services.filter(service => service.category === 'marketing')
  },
  {
    id: 'social',
    name: 'Social Media Campaigns',
    services: services.filter(service => service.category === 'social')
  },
  {
    id: 'ott',
    name: 'OTT Campaigns',
    services: services.filter(service => service.category === 'ott'),
    comingSoon: true
  }
];
