
import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

export function useLocations() {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
      return;
    }
    const countryStates = State.getStatesOfCountry(selectedCountry);
    setStates(countryStates);
    setSelectedState('');
    setCities([]);
    setSelectedCity('');
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState || !selectedCountry) {
      setCities([]);
      setSelectedCity('');
      return;
    }
    const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
    setCities(stateCities);
    setSelectedCity('');
  }, [selectedState, selectedCountry]);

  return {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    loading
  };
}
