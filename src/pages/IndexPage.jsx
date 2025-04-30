import { usePlaces } from '../../hooks';
import { useFilters } from '../context/FilterContext';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';

const IndexPage = () => {
  const allPlaces = usePlaces();
  const { places, loading } = allPlaces;
  const { filters } = useFilters();

  const filterPlaces = (places) => {
    return places.filter((place) => {
      // Location filter
      if (
        filters.location &&
        !place.address.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          if (place.price < min || place.price > max) return false;
        } else {
          // For "15000+" case
          if (place.price < min) return false;
        }
      }

      // Property type filter
      if (filters.propertyType && place.propertyType !== filters.propertyType) {
        return false;
      }

      // Capacity filter
      if (filters.capacity) {
        const [min, max] = filters.capacity.split('-').map(Number);
        if (max) {
          if (place.maxGuests < min || place.maxGuests > max) return false;
        } else {
          // For "5+" case
          if (place.maxGuests < min) return false;
        }
      }

      return true;
    });
  };

  const filteredPlaces = filters ? filterPlaces(places) : places;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 justify-items-center px-4 py-32 md:grid-cols-2 md:gap-0 lg:grid-cols-3 lg:gap-2 xl:grid-cols-4 xl:gap-10">
      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((place) => (
          <PlaceCard place={place} key={place._id} />
        ))
      ) : (
        <div className="absolute left-1/2 right-1/2 top-40 flex w-full -translate-x-1/2 transform flex-col p-10 md:w-1/2">
          <h1 className="text-3xl font-semibold">No results found!</h1>
          <p className="text-lg font-semibold">
            Try adjusting your filters to find more places.
          </p>
          <button
            className="mt-4 w-32 rounded-full bg-primary p-2 text-white"
            onClick={() => window.location.reload()}
          >
            <span className="flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Reset Filters
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
