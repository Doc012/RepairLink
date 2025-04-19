import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-x-2">
      <span className="text-xl font-bold text-blue-500">RepairLink</span>
    </Link>
  );
};

export default Logo;