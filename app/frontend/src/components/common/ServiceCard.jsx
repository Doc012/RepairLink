import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, icon: Icon }) => {
  return (
    <Link 
      to={`/services/${title.toLowerCase()}`}
      className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        {Icon && <Icon className="h-6 w-6 text-blue-600" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </Link>
  );
};

export default ServiceCard;