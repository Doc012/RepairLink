export const serviceDetails = {
  plumbing: {
    name: 'Plumbing Services',
    description: 'Professional plumbing services for residential and commercial properties.',
    rating: 4.8,
    totalReviews: 156,
    features: [
      'Emergency Plumbing Services',
      'Leak Detection & Repair',
      'Geyser Installation & Repair',
      'Drain Cleaning & Maintenance',
      'Pipe Installation & Replacement',
      'Bathroom & Kitchen Plumbing'
    ],
    pricing: [
      { 
        service: 'Basic Plumbing Inspection',
        priceRange: 'R350 - R500',
        duration: '1 hour' 
      },
      { 
        service: 'Leak Repair',
        priceRange: 'R450 - R850',
        duration: '1-2 hours' 
      },
      { 
        service: 'Geyser Installation',
        priceRange: 'R3500 - R6500',
        duration: '3-4 hours' 
      },
      { 
        service: 'Drain Cleaning',
        priceRange: 'R550 - R1200',
        duration: '1-2 hours' 
      }
    ],
    faqs: [
      {
        question: 'Do you offer emergency services?',
        answer: 'Yes, we provide 24/7 emergency plumbing services across major South African cities.'
      },
      {
        question: 'Are your plumbers certified?',
        answer: 'All our plumbers are certified and registered with the Plumbing Industry Registration Board (PIRB).'
      },
      {
        question: 'What areas do you service?',
        answer: 'We currently service all major metros including Johannesburg, Pretoria, Cape Town, and Durban.'
      },
      {
        question: 'Do you provide warranties?',
        answer: 'Yes, all our work comes with a 6-month workmanship warranty, and we honor manufacturer warranties on all parts.'
      }
    ],
    reviews: [
      {
        id: 1,
        author: 'Johan van der Merwe',
        rating: 5,
        date: '2024-04-01',
        comment: 'Excellent service! The plumber arrived on time and fixed our geyser issue quickly.',
        location: 'Sandton, Gauteng'
      },
      {
        id: 2,
        author: 'Michelle Peters',
        rating: 5,
        date: '2024-03-30',
        comment: 'Fantastic service! Fixed our burst pipe emergency within an hour of calling.',
        location: 'Camps Bay, Cape Town'
      },
      {
        id: 3,
        author: 'Thabo Molefe',
        rating: 4,
        date: '2024-03-25',
        comment: 'Very professional team. Installed our new geyser efficiently.',
        location: 'Centurion, Gauteng'
      },
      {
        id: 4,
        author: 'Amanda Singh',
        rating: 5,
        date: '2024-03-22',
        comment: 'Great experience from start to finish. Fair pricing and excellent workmanship.',
        location: 'Umhlanga, KZN'
      }
    ],
    providers: [
      {
        id: 1,
        name: 'Master Plumbing Solutions',
        rating: 4.9,
        reviews: [
          {
            id: 1,
            author: 'John Smith',
            rating: 5,
            date: '2024-04-01',
            comment: 'Excellent service, very professional team.',
            location: 'Sandton, Gauteng'
          },
          // Add more reviews...
        ],
        phone: '+27 (0) 11 234 5678',
        email: 'info@masterplumbing.co.za',
        hours: 'Monday - Friday: 8:00 AM - 5:00 PM',
        location: 'Sandton, Gauteng',
        available: true,
        pricing: [
          { 
            service: 'Basic Plumbing Inspection',
            price: 'R400',
            duration: '1 hour' 
          },
          { 
            service: 'Leak Repair',
            price: 'R600',
            duration: '1-2 hours' 
          },
          // ...more pricing items
        ],
        faqs: [
          {
            question: 'What areas do you service?',
            answer: 'We service all areas in and around Sandton, including Bryanston, Morningside, and Rosebank.'
          },
          {
            question: 'Do you offer emergency services?',
            answer: 'Yes, we provide 24/7 emergency plumbing services with a response time of under 1 hour.'
          },
          // ...more FAQs
        ]
      },
      {
        id: 2,
        name: 'Cape Town Plumbing Pros',
        rating: 4.7,
        reviews: 92,
        location: 'Cape Town, Western Cape',
        available: true
      },
      {
        id: 3,
        name: 'Durban Plumbing Services',
        rating: 4.8,
        reviews: 76,
        location: 'Durban, KZN',
        available: true
      },
      {
        id: 4,
        name: 'Pretoria Plumbers',
        rating: 4.6,
        reviews: 64,
        location: 'Pretoria, Gauteng',
        available: true
      }
    ]
  },
  electrical: {
    name: 'Electrical Services',
    description: 'Professional electrical services for homes and businesses.',
    rating: 4.9,
    totalReviews: 203,
    features: [
      'Electrical Installations',
      'Load Shedding Solutions',
      'Solar Power Systems',
      'Wiring & Rewiring',
      'Emergency Repairs',
      'Safety Inspections'
    ],
    pricing: [
      { 
        service: 'Electrical Inspection',
        priceRange: 'R400 - R600',
        duration: '1 hour' 
      },
      { 
        service: 'Circuit Installation',
        priceRange: 'R750 - R1,200',
        duration: '2-3 hours' 
      },
      { 
        service: 'Inverter Installation',
        priceRange: 'R12,000 - R35,000',
        duration: '4-6 hours' 
      },
      { 
        service: 'Solar System Installation',
        priceRange: 'R45,000 - R150,000',
        duration: '1-3 days' 
      },
      {
        service: 'DB Board Upgrade',
        priceRange: 'R2,500 - R4,500',
        duration: '3-4 hours'
      }
    ],
    faqs: [
      {
        question: 'Are your electricians certified?',
        answer: 'Yes, all our electricians are certified and registered with the Electrical Contractors Association (ECA).'
      },
      {
        question: 'Do you handle load shedding solutions?',
        answer: 'Yes, we provide comprehensive load shedding solutions including inverter systems, UPS installations, and solar power systems.'
      },
      {
        question: 'What types of electrical certificates do you provide?',
        answer: 'We provide Certificates of Compliance (CoC) for all electrical installations as required by South African law.'
      },
      {
        question: 'How long does a typical solar installation take?',
        answer: 'A typical residential solar installation takes 1-2 days, depending on system size and complexity.'
      }
    ],
    reviews: [
      {
        id: 1,
        author: 'Sarah Naidoo',
        rating: 5,
        date: '2024-03-28',
        comment: 'Excellent work on our solar installation. Very professional team.',
        location: 'Durban, KZN'
      },
      {
        id: 2,
        author: 'James Wilson',
        rating: 5,
        date: '2024-03-27',
        comment: 'Excellent work on our home automation system. Very knowledgeable team.',
        location: 'Bryanston, Gauteng'
      },
      {
        id: 3,
        author: 'Nomvula Khumalo',
        rating: 4,
        date: '2024-03-24',
        comment: 'Professional installation of our inverter system. Great service during load shedding crisis.',
        location: 'Midrand, Gauteng'
      },
      {
        id: 4,
        author: 'David Chen',
        rating: 5,
        date: '2024-03-20',
        comment: 'Fantastic work on our office electrical upgrade. Minimal disruption to business.',
        location: 'Century City, Cape Town'
      }
    ],
    providers: [
      {
        id: 1,
        name: 'PowerTech Electrical',
        rating: 4.8,
        reviews: [
          {
            id: 1,
            author: 'Sarah Johnson',
            rating: 5,
            date: '2024-04-02',
            comment: 'Fantastic work on our solar installation. Professional and efficient.',
            location: 'Durban North, KZN'
          },
          {
            id: 2,
            author: 'Mike Peterson',
            rating: 5,
            date: '2024-03-30',
            comment: 'Great service during our emergency electrical issue.',
            location: 'Umhlanga, KZN'
          }
        ],
        phone: '+27 (0) 31 234 5678',
        email: 'info@powertech.co.za',
        hours: 'Monday - Saturday: 7:00 AM - 6:00 PM',
        location: 'Durban, KZN',
        available: true,
        pricing: [
          {
            service: 'Electrical Inspection',
            priceRange: 'R450 - R550',
            duration: '1 hour'
          },
          {
            service: 'Circuit Installation',
            priceRange: 'R850 - R1,100',
            duration: '2-3 hours'
          },
          {
            service: 'Inverter Installation',
            price: 'R12,000 - R35,000',
            duration: '4-6 hours'
          },
          {
            service: 'Solar System Installation',
            price: 'R45,000 - R120,000',
            duration: '1-2 days'
          }
        ],
        faqs: [
          {
            question: 'Do you provide certificates of compliance (COC)?',
            answer: 'Yes, we provide COCs for all electrical installations as required by law.'
          },
          {
            question: 'What solar system sizes do you install?',
            answer: 'We install systems ranging from 3kW to 20kW for residential properties.'
          },
          {
            question: 'Do you offer maintenance contracts?',
            answer: 'Yes, we offer annual maintenance contracts for both solar and electrical systems.'
          }
        ]
      },
      {
        id: 2,
        name: 'Solar Solutions SA',
        rating: 4.9,
        reviews: [
          {
            id: 1,
            author: 'David Smith',
            rating: 5,
            date: '2024-04-01',
            comment: 'Excellent solar installation service. Very knowledgeable team.',
            location: 'Sandton, Gauteng'
          }
        ],
        phone: '+27 (0) 11 345 6789',
        email: 'info@solarsolutions.co.za',
        hours: 'Monday - Friday: 8:00 AM - 5:00 PM',
        location: 'Johannesburg, Gauteng',
        available: true,
        pricing: [
          {
            service: 'Solar Consultation',
            price: 'Free',
            duration: '1 hour'
          },
          {
            service: '5kW Solar System',
            price: 'R85,000',
            duration: '2 days'
          },
          {
            service: '10kW Solar System',
            price: 'R150,000',
            duration: '2-3 days'
          }
        ],
        faqs: [
          {
            question: 'What warranty do you offer on solar installations?',
            answer: 'We offer 25 years on panels, 10 years on inverters, and 5 years on workmanship.'
          },
          {
            question: 'How long does a typical installation take?',
            answer: 'Most residential installations are completed within 1-2 days.'
          }
        ]
      },
      {
        id: 3,
        name: 'Cape Electrical Experts',
        rating: 4.7,
        reviews: [
          {
            id: 1,
            author: 'James Wilson',
            rating: 4,
            date: '2024-03-25',
            comment: 'Good service, fixed our electrical issues promptly.',
            location: 'Sea Point, Cape Town'
          }
        ],
        phone: '+27 (0) 21 456 7890',
        email: 'info@capeelectrical.co.za',
        hours: 'Monday - Friday: 8:00 AM - 5:00 PM',
        location: 'Cape Town, Western Cape',
        available: true,
        pricing: [
          {
            service: 'Electrical Fault Finding',
            price: 'R550',
            duration: '1 hour'
          },
          {
            service: 'DB Board Upgrade',
            price: 'From R2,500',
            duration: '3-4 hours'
          }
        ],
        faqs: [
          {
            question: 'Do you handle emergency calls?',
            answer: 'Yes, we offer 24/7 emergency electrical services in the Cape Town area.'
          }
        ]
      },
      {
        id: 4,
        name: 'Pretoria Electrical Services',
        rating: 4.6,
        reviews: 72,
        location: 'Pretoria, Gauteng',
        available: true
      },
      {
        id: 5,
        name: 'East Coast Electricians',
        rating: 4.8,
        reviews: 94,
        location: 'Durban, KZN',
        available: false
      }
    ]
  }
};