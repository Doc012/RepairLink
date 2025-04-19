import Slider from 'react-slick';
import Button from '../../common/Button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slides = [
  {
    id: 1,
    title: "Professional Plumbing Services",
    description: "Expert plumbers ready to tackle any repair, from leaky faucets to complete pipe installations.",
    image: "https://cdn.prod.website-files.com/643dd13153ce80ea0a9ceae9/64a2d407bfcebde9109cf23a_Bathroom%20Plumbing.png",
  },
  {
    id: 2,
    title: "Complete Yard Maintenance",
    description: "Keep your outdoor spaces pristine with our professional lawn care and landscaping services.",
    image: "https://f.hubspotusercontent20.net/hubfs/6888774/commercial%20lawn%20care%20edging%20crew%20.jpg",
  },
  {
    id: 3,
    title: "Licensed Electrical Services",
    description: "Certified electricians providing safe and reliable electrical repairs and installations.",
    image: "https://onepullwire.com/wp-content/uploads/2022/02/10-Specializations-Comm-Electricians.jpeg",
  },
  {
    id: 4,
    title: "Expert Electronics Repair",
    description: "Professional computer and electronics repair services to keep your devices running smoothly.",
    image: "https://themanufacturer-cdn-1.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/02/12155141/electronics-LARGE.jpg",
  }
];

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="relative h-[600px]">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>
              
              {/* Content */}
              <div className="relative h-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
                  <div className="flex items-center justify-center h-full">
                    <div className="max-w-2xl text-center">
                      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mt-6 text-lg leading-8 text-gray-100">
                        {slide.description}
                      </p>
                      <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button to="/register" variant="primary">
                          Get Started
                        </Button>
                        <Button 
                          to="/about" 
                          variant="secondary" 
                          className="text-white hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;