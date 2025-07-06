
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign, MapPin, Phone, Mail, ArrowLeft, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const Doctor = () => {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState("");

  // Mock doctor data with Indian details
  const doctor = {
    id: 1,
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.9,
    reviews: 247,
    image: "https://images.unsplash.com/photo-1594824804732-ca0916aa2cbc?w=400&h=400&fit=crop&crop=face",
    consultationFee: "₹800",
    location: "Apollo Hospital, New Delhi",
    phone: "+91 9876543210",
    email: "dr.priya.sharma@apollo.com",
    about: "Dr. Priya Sharma is a renowned cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart failure management, and interventional procedures. Dr. Sharma is known for her compassionate care and patient-centered approach to medicine.",
    education: [
      "MBBS - All India Institute of Medical Sciences (AIIMS), New Delhi",
      "MD Cardiology - Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh",
      "Fellowship in Interventional Cardiology - Fortis Escorts Heart Institute, New Delhi"
    ],
    availableSlots: [
      { date: "Today", time: "2:00 PM", available: true },
      { date: "Today", time: "3:30 PM", available: true },
      { date: "Today", time: "5:00 PM", available: false },
      { date: "Tomorrow", time: "9:00 AM", available: true },
      { date: "Tomorrow", time: "10:30 AM", available: true },
      { date: "Tomorrow", time: "2:00 PM", available: true },
    ]
  };

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      alert("Please select an appointment slot");
      return;
    }
    // In real app, this would integrate with Supabase
    alert(`Appointment booked for ${selectedSlot}! You will receive a confirmation email shortly.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/explore" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
                    <Badge variant="secondary" className="mb-3 text-sm">
                      {doctor.specialization}
                    </Badge>
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">{doctor.rating}</span>
                        <span className="text-gray-500 ml-1">({doctor.reviews} reviews)</span>
                      </div>
                      <div className="text-gray-600">{doctor.experience} experience</div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center justify-center md:justify-start">
                        <MapPin className="h-4 w-4 mr-2" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About Dr. {doctor.name.split(' ')[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{doctor.about}</p>
                <h4 className="font-semibold mb-2">Education & Training</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {doctor.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Consultation Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">{doctor.consultationFee}</div>
                <p className="text-gray-600 text-sm">Per consultation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Available Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    doctor.availableSlots.reduce((acc, slot) => {
                      if (!acc[slot.date]) acc[slot.date] = [];
                      acc[slot.date].push(slot);
                      return acc;
                    }, {} as Record<string, typeof doctor.availableSlots>)
                  ).map(([date, slots]) => (
                    <div key={date}>
                      <h4 className="font-semibold mb-2 text-gray-700">{date}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedSlot === `${slot.date} ${slot.time}` ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(`${slot.date} ${slot.time}`)}
                            className="text-xs"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-6" 
                  onClick={handleBookAppointment}
                  disabled={!selectedSlot}
                >
                  Book Appointment
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You'll receive confirmation via email
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
