import { StarIcon } from '@heroicons/react/20/solid';
import Button from '../../common/Button';

const ProfessionalCard = ({ professional }) => {
  const { name, image, specialty, rating, reviews, location } = professional;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden dark:bg-slate-800">
      <div className="aspect-w-3 aspect-h-2">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover" 
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">{rating}</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{specialty}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">{location}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">{reviews} reviews</p>
        <div className="mt-4">
          <Button to={`/professionals/${name.toLowerCase().replace(/\s+/g, '-')}`} variant="secondary" className="w-full">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;