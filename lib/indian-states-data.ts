// Indian states and their districts data with comprehensive information
export interface StateData {
  stateCode: string
  stateName: string
  capital: string
  population: string
  area: string
  language: string
  districts: DistrictData[]
  keyCities: string[]
  regionalHighlights: string[]
  demographics: {
    literacy: string
    urbanPopulation: string
    ruralPopulation: string
  }
}

export interface DistrictData {
  districtName: string
  cities: string[]
}

export const INDIAN_STATES: StateData[] = [
  {
    stateCode: "TS",
    stateName: "Telangana",
    capital: "Hyderabad",
    population: "39.12 million",
    area: "112,077 km²",
    language: "Telugu, Urdu",
    keyCities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    regionalHighlights: [
      "IT Hub of India - HITEC City",
      "Historic Charminar and Golconda Fort",
      "Famous for Hyderabadi Biryani",
      "Major pharmaceutical manufacturing center",
      "Rich cultural heritage and festivals",
    ],
    demographics: {
      literacy: "66.5%",
      urbanPopulation: "38.9%",
      ruralPopulation: "61.1%",
    },
    districts: [
      {
        districtName: "Hyderabad Central",
        cities: ["Banjara Hills", "Jubilee Hills", "Somajiguda", "Begumpet", "Secunderabad"],
      },
      {
        districtName: "Hyderabad East",
        cities: ["LB Nagar", "Uppal", "Nacharam", "Habsiguda", "Dilsukhnagar"],
      },
      {
        districtName: "Hyderabad West",
        cities: ["Kukatpally", "Miyapur", "Madhapur", "Gachibowli", "HITEC City"],
      },
      {
        districtName: "Warangal Urban",
        cities: ["Warangal City", "Kazipet", "Hanmakonda", "Hanamkonda", "Subedari"],
      },
      {
        districtName: "Karimnagar",
        cities: ["Karimnagar", "Jagtial", "Peddapalli", "Huzurabad", "Sircilla"],
      },
      {
        districtName: "Nizamabad",
        cities: ["Nizamabad", "Armoor", "Bodhan", "Kamareddy", "Banswada"],
      },
      {
        districtName: "Khammam",
        cities: ["Khammam", "Kothagudem", "Yellandu", "Bhadrachalam", "Madhira"],
      },
      {
        districtName: "Nalgonda",
        cities: ["Nalgonda", "Miryalaguda", "Suryapet", "Bhongir", "Devarakonda"],
      },
    ],
  },
  {
    stateCode: "AP",
    stateName: "Andhra Pradesh",
    capital: "Amaravati",
    population: "53.9 million",
    area: "160,205 km²",
    language: "Telugu",
    keyCities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada"],
    regionalHighlights: [
      "Tirupati Temple - World's richest temple",
      "Major port city Visakhapatnam",
      "Rice bowl of India",
      "Famous for Kuchipudi dance",
      "Araku Valley coffee plantations",
    ],
    demographics: {
      literacy: "67.7%",
      urbanPopulation: "33.4%",
      ruralPopulation: "66.6%",
    },
    districts: [
      {
        districtName: "Visakhapatnam",
        cities: ["Visakhapatnam", "Vizag", "Gajuwaka", "Bheemunipatnam", "Anakapalle"],
      },
      {
        districtName: "Vijayawada",
        cities: ["Vijayawada", "Guntur", "Tenali", "Mangalagiri", "Tadepalli"],
      },
      {
        districtName: "Tirupati",
        cities: ["Tirupati", "Chandragiri", "Puttur", "Srikalahasti", "Renigunta"],
      },
      {
        districtName: "Kakinada",
        cities: ["Kakinada", "Rajahmundry", "Amalapuram", "Peddapuram", "Tuni"],
      },
      {
        districtName: "Nellore",
        cities: ["Nellore", "Gudur", "Kavali", "Atmakur", "Venkatagiri"],
      },
    ],
  },
  {
    stateCode: "KA",
    stateName: "Karnataka",
    capital: "Bengaluru",
    population: "68.5 million",
    area: "191,791 km²",
    language: "Kannada",
    keyCities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
    regionalHighlights: [
      "Silicon Valley of India",
      "Mysore Palace and heritage",
      "Coffee plantations in Coorg",
      "Hampi UNESCO World Heritage Site",
      "Major IT and startup hub",
    ],
    demographics: {
      literacy: "75.4%",
      urbanPopulation: "38.7%",
      ruralPopulation: "61.3%",
    },
    districts: [
      {
        districtName: "Bangalore Urban",
        cities: ["Bangalore", "Whitefield", "Electronic City", "Koramangala", "Indiranagar"],
      },
      {
        districtName: "Bangalore Rural",
        cities: ["Devanahalli", "Nelamangala", "Doddaballapur", "Hoskote", "Magadi"],
      },
      {
        districtName: "Mysore",
        cities: ["Mysore", "Mandya", "Srirangapatna", "KR Nagar", "Hunsur"],
      },
      {
        districtName: "Mangalore",
        cities: ["Mangalore", "Udupi", "Manipal", "Kundapura", "Karkala"],
      },
      {
        districtName: "Hubli-Dharwad",
        cities: ["Hubli", "Dharwad", "Gadag", "Belgaum", "Haveri"],
      },
    ],
  },
  {
    stateCode: "TN",
    stateName: "Tamil Nadu",
    capital: "Chennai",
    population: "77.8 million",
    area: "130,060 km²",
    language: "Tamil",
    keyCities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    regionalHighlights: [
      "Meenakshi Temple in Madurai",
      "Marina Beach - Second longest beach",
      "Bharatanatyam classical dance",
      "Major automobile manufacturing hub",
      "Ancient Chola temples",
    ],
    demographics: {
      literacy: "80.1%",
      urbanPopulation: "48.4%",
      ruralPopulation: "51.6%",
    },
    districts: [
      {
        districtName: "Chennai North",
        cities: ["Anna Nagar", "Kilpauk", "Perambur", "Royapuram", "Tondiarpet"],
      },
      {
        districtName: "Chennai South",
        cities: ["Adyar", "Velachery", "Tambaram", "Pallavaram", "Chromepet"],
      },
      {
        districtName: "Coimbatore",
        cities: ["Coimbatore", "Pollachi", "Mettupalayam", "Valparai", "Tiruppur"],
      },
      {
        districtName: "Madurai",
        cities: ["Madurai", "Dindigul", "Theni", "Melur", "Usilampatti"],
      },
      {
        districtName: "Trichy",
        cities: ["Tiruchirappalli", "Srirangam", "Lalgudi", "Manapparai", "Musiri"],
      },
    ],
  },
  {
    stateCode: "MH",
    stateName: "Maharashtra",
    capital: "Mumbai",
    population: "123.1 million",
    area: "307,713 km²",
    language: "Marathi",
    keyCities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    regionalHighlights: [
      "Financial capital of India",
      "Bollywood film industry",
      "Gateway of India monument",
      "Ajanta and Ellora Caves",
      "Major industrial and commercial hub",
    ],
    demographics: {
      literacy: "82.3%",
      urbanPopulation: "45.2%",
      ruralPopulation: "54.8%",
    },
    districts: [
      {
        districtName: "Mumbai City",
        cities: ["South Mumbai", "Bandra", "Andheri", "Borivali", "Dadar"],
      },
      {
        districtName: "Mumbai Suburban",
        cities: ["Thane", "Navi Mumbai", "Kalyan", "Dombivli", "Mira Road"],
      },
      {
        districtName: "Pune",
        cities: ["Pune", "Pimpri-Chinchwad", "Kharadi", "Hinjewadi", "Wakad"],
      },
      {
        districtName: "Nagpur",
        cities: ["Nagpur", "Kamptee", "Ramtek", "Katol", "Umred"],
      },
      {
        districtName: "Nashik",
        cities: ["Nashik", "Malegaon", "Sinnar", "Igatpuri", "Trimbak"],
      },
    ],
  },
  {
    stateCode: "DL",
    stateName: "Delhi",
    capital: "New Delhi",
    population: "19.8 million",
    area: "1,484 km²",
    language: "Hindi, English",
    keyCities: ["New Delhi", "Old Delhi", "Dwarka", "Rohini", "Saket"],
    regionalHighlights: [
      "Capital of India",
      "Red Fort and India Gate",
      "Qutub Minar UNESCO site",
      "Major political and cultural center",
      "Metro rail network",
    ],
    demographics: {
      literacy: "86.2%",
      urbanPopulation: "97.5%",
      ruralPopulation: "2.5%",
    },
    districts: [
      {
        districtName: "Central Delhi",
        cities: ["Connaught Place", "Karol Bagh", "Paharganj", "Daryaganj", "Chandni Chowk"],
      },
      {
        districtName: "South Delhi",
        cities: ["Hauz Khas", "Saket", "Greater Kailash", "Defence Colony", "Lajpat Nagar"],
      },
      {
        districtName: "North Delhi",
        cities: ["Civil Lines", "Model Town", "Rohini", "Pitampura", "Shalimar Bagh"],
      },
      {
        districtName: "East Delhi",
        cities: ["Mayur Vihar", "Laxmi Nagar", "Preet Vihar", "Shahdara", "Vivek Vihar"],
      },
      {
        districtName: "West Delhi",
        cities: ["Janakpuri", "Rajouri Garden", "Dwarka", "Vikaspuri", "Tilak Nagar"],
      },
    ],
  },
  {
    stateCode: "GJ",
    stateName: "Gujarat",
    capital: "Gandhinagar",
    population: "63.9 million",
    area: "196,244 km²",
    language: "Gujarati",
    keyCities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    regionalHighlights: [
      "Statue of Unity - World's tallest statue",
      "Rann of Kutch white desert",
      "Gir National Park - Asiatic lions",
      "Major textile and diamond industry",
      "Birthplace of Mahatma Gandhi",
    ],
    demographics: {
      literacy: "78.0%",
      urbanPopulation: "42.6%",
      ruralPopulation: "57.4%",
    },
    districts: [
      {
        districtName: "Ahmedabad",
        cities: ["Ahmedabad", "Gandhinagar", "Sanand", "Dholka", "Bavla"],
      },
      {
        districtName: "Surat",
        cities: ["Surat", "Navsari", "Valsad", "Bardoli", "Vyara"],
      },
      {
        districtName: "Vadodara",
        cities: ["Vadodara", "Anand", "Bharuch", "Karjan", "Dabhoi"],
      },
      {
        districtName: "Rajkot",
        cities: ["Rajkot", "Jamnagar", "Morbi", "Gondal", "Jetpur"],
      },
    ],
  },
  {
    stateCode: "RJ",
    stateName: "Rajasthan",
    capital: "Jaipur",
    population: "79.5 million",
    area: "342,239 km²",
    language: "Hindi, Rajasthani",
    keyCities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    regionalHighlights: [
      "Pink City - Jaipur",
      "Thar Desert and camel safaris",
      "Magnificent forts and palaces",
      "Pushkar Camel Fair",
      "Rich Rajput heritage and culture",
    ],
    demographics: {
      literacy: "66.1%",
      urbanPopulation: "24.9%",
      ruralPopulation: "75.1%",
    },
    districts: [
      {
        districtName: "Jaipur",
        cities: ["Jaipur", "Amber", "Sanganer", "Chomu", "Phulera"],
      },
      {
        districtName: "Jodhpur",
        cities: ["Jodhpur", "Pali", "Bilara", "Osian", "Bhopalgarh"],
      },
      {
        districtName: "Udaipur",
        cities: ["Udaipur", "Chittorgarh", "Rajsamand", "Nathdwara", "Salumbar"],
      },
      {
        districtName: "Kota",
        cities: ["Kota", "Bundi", "Jhalawar", "Baran", "Ramganj Mandi"],
      },
    ],
  },
  {
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    capital: "Lucknow",
    population: "237.9 million",
    area: "240,928 km²",
    language: "Hindi, Urdu",
    keyCities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
    regionalHighlights: [
      "Taj Mahal - Wonder of the World",
      "Varanasi - Spiritual capital",
      "Most populous state in India",
      "Birthplace of Lord Rama - Ayodhya",
      "Rich Mughal and Awadhi heritage",
    ],
    demographics: {
      literacy: "67.7%",
      urbanPopulation: "22.3%",
      ruralPopulation: "77.7%",
    },
    districts: [
      {
        districtName: "Lucknow",
        cities: ["Lucknow", "Gomti Nagar", "Hazratganj", "Alambagh", "Chinhat"],
      },
      {
        districtName: "Noida",
        cities: ["Noida", "Greater Noida", "Ghaziabad", "Faridabad", "Meerut"],
      },
      {
        districtName: "Kanpur",
        cities: ["Kanpur", "Unnao", "Kanpur Dehat", "Bithoor", "Ghatampur"],
      },
      {
        districtName: "Agra",
        cities: ["Agra", "Mathura", "Firozabad", "Fatehabad", "Kiraoli"],
      },
      {
        districtName: "Varanasi",
        cities: ["Varanasi", "Chandauli", "Ghazipur", "Jaunpur", "Mirzapur"],
      },
    ],
  },
  {
    stateCode: "WB",
    stateName: "West Bengal",
    capital: "Kolkata",
    population: "99.6 million",
    area: "88,752 km²",
    language: "Bengali",
    keyCities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
    regionalHighlights: [
      "Cultural capital of India",
      "Victoria Memorial and Howrah Bridge",
      "Darjeeling tea gardens",
      "Sundarbans mangrove forest",
      "Durga Puja festival celebrations",
    ],
    demographics: {
      literacy: "76.3%",
      urbanPopulation: "31.9%",
      ruralPopulation: "68.1%",
    },
    districts: [
      {
        districtName: "Kolkata",
        cities: ["Kolkata", "Salt Lake", "New Town", "Behala", "Jadavpur"],
      },
      {
        districtName: "Howrah",
        cities: ["Howrah", "Liluah", "Bally", "Shibpur", "Santragachi"],
      },
      {
        districtName: "Siliguri",
        cities: ["Siliguri", "Jalpaiguri", "Darjeeling", "Kalimpong", "Kurseong"],
      },
      {
        districtName: "Durgapur",
        cities: ["Durgapur", "Asansol", "Raniganj", "Kulti", "Burnpur"],
      },
    ],
  },
  {
    stateCode: "KL",
    stateName: "Kerala",
    capital: "Thiruvananthapuram",
    population: "35.7 million",
    area: "38,852 km²",
    language: "Malayalam",
    keyCities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    regionalHighlights: [
      "God's Own Country",
      "Backwaters and houseboats",
      "Highest literacy rate in India",
      "Ayurveda and wellness tourism",
      "Kathakali dance and art forms",
    ],
    demographics: {
      literacy: "94.0%",
      urbanPopulation: "47.7%",
      ruralPopulation: "52.3%",
    },
    districts: [
      {
        districtName: "Thiruvananthapuram",
        cities: ["Thiruvananthapuram", "Kovalam", "Neyyattinkara", "Attingal", "Varkala"],
      },
      {
        districtName: "Kochi",
        cities: ["Kochi", "Ernakulam", "Fort Kochi", "Aluva", "Perumbavoor"],
      },
      {
        districtName: "Kozhikode",
        cities: ["Kozhikode", "Malappuram", "Vadakara", "Koyilandy", "Feroke"],
      },
      {
        districtName: "Thrissur",
        cities: ["Thrissur", "Chalakudy", "Irinjalakuda", "Kodungallur", "Guruvayur"],
      },
    ],
  },
]

export function getStateByCode(stateCode: string): StateData | undefined {
  return INDIAN_STATES.find((state) => state.stateCode === stateCode)
}

export function getDistrictsByState(stateCode: string): DistrictData[] {
  const state = getStateByCode(stateCode)
  return state ? state.districts : []
}

export function getAllStates(): { code: string; name: string }[] {
  return INDIAN_STATES.map((state) => ({
    code: state.stateCode,
    name: state.stateName,
  }))
}
