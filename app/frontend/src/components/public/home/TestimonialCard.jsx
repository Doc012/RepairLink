import { StarIcon } from '@heroicons/react/20/solid';

const TestimonialCard = ({ testimonial }) => {
  const { name, location, rating, comment, service, date } = testimonial;

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="flex items-center gap-x-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
      <p className="mt-4 flex-grow text-base text-slate-600 dark:text-slate-400">
        "{comment}"
      </p>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{name}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-500">{location}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">{service}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;