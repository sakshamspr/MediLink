import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, IndianRupee, MapPin, Phone, Mail, ArrowLeft, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";
import { useDoctor, useAvailableSlots } from "@/hooks/useDoctors";

const Doctor = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSlot, setSelectedSlot] = useState("");

  const { data: doctor, isLoading, refetch: refetchDoctor } = useDoctor(id!);
  const { data: availableSlots = [], refetch: refetchSlots } = useAvailableSlots(id!);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleBookingSuccess = () => {
    setSelectedSlot("");
    refetchSlots();
    refetchDoctor();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading doctor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Doctor not found.</p>
            <Link to="/explore" className="text-blue-600 hover:underline">
              Browse all doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.slot_date]) acc[slot.slot_date] = [];
    acc[slot.slot_date].push(slot);
    return acc;
  }, {});

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
                    src={doctor.image_url}
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
                <CardTitle>About {doctor.name.split(' ')[1]}</CardTitle>
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
                  <IndianRupee className="h-5 w-5 mr-2" />
                  Consultation Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">₹{doctor.consultation_fee}</div>
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
                  {Object.entries(slotsByDate).map(([date, slots]: [string, any[]]) => (
                    <div key={date}>
                      <h4 className="font-semibold mb-2 text-gray-700">{formatDate(date)}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot === `${slot.id}|${slot.slot_date}|${slot.slot_time}` ? "default" : "outline"}
                            size="sm"
                            disabled={!slot.is_available}
                            onClick={() => setSelectedSlot(`${slot.id}|${slot.slot_date}|${slot.slot_time}`)}
                            className="text-xs"
                          >
                            {slot.slot_time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <BookingForm 
                    doctor={doctor}
                    selectedSlot={selectedSlot}
                    onBookingSuccess={handleBookingSuccess}
                  />
                </div>
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
