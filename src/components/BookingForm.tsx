
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Calendar, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  doctor: any;
  selectedSlot: string;
  onBookingSuccess: () => void;
}

interface BookingFormData {
  patientName: string;
  patientEmail: string;
}

const BookingForm = ({ doctor, selectedSlot, onBookingSuccess }: BookingFormProps) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<BookingFormData>({
    defaultValues: {
      patientName: "",
      patientEmail: "",
    },
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleBookAppointment = async (data: BookingFormData) => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        description: "Choose an available appointment slot to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    try {
      const [slotId, date, time] = selectedSlot.split('|');
      
      // First check if slot is still available
      const { data: slotCheck, error: slotCheckError } = await supabase
        .from('available_slots')
        .select('is_available')
        .eq('id', slotId)
        .single();

      if (slotCheckError) {
        console.error('Slot check error:', slotCheckError);
        throw new Error('Failed to verify slot availability');
      }

      if (!slotCheck.is_available) {
        toast({
          title: "Slot No Longer Available",
          description: "This time slot has been booked by someone else. Please select another slot.",
          variant: "destructive"
        });
        onBookingSuccess(); // Refresh the slots
        return;
      }
      
      // Get the current user or create a session identifier
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || crypto.randomUUID(); // Generate a temporary UUID for anonymous users
      
      // Create appointment with either authenticated user ID or generated UUID
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          doctor_id: doctor.id,
          slot_id: slotId,
          appointment_date: date,
          appointment_time: time,
          status: 'confirmed'
        });

      if (appointmentError) {
        console.error('Appointment creation error:', appointmentError);
        throw appointmentError;
      }

      // Mark slot as unavailable
      const { error: slotError } = await supabase
        .from('available_slots')
        .update({ is_available: false })
        .eq('id', slotId);

      if (slotError) {
        console.error('Slot update error:', slotError);
        throw slotError;
      }

      // Send confirmation email
      try {
        const emailResponse = await supabase.functions.invoke('send-appointment-confirmation', {
          body: {
            doctorName: doctor.name,
            patientEmail: data.patientEmail,
            patientName: data.patientName,
            appointmentDate: formatDate(date),
            appointmentTime: time,
            consultationFee: doctor.consultation_fee
          }
        });

        console.log('Email function response:', emailResponse);

        if (emailResponse.error) {
          console.error('Email sending failed:', emailResponse.error);
          toast({
            title: "Appointment Booked Successfully!",
            description: `Your appointment with ${doctor.name} has been confirmed for ${formatDate(date)} at ${time}. However, confirmation email could not be sent.`,
            variant: "default"
          });
        } else {
          toast({
            title: "Appointment Booked Successfully!",
            description: `Your appointment with ${doctor.name} has been confirmed for ${formatDate(date)} at ${time}. You will receive a confirmation email shortly.`,
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Appointment Booked Successfully!",
          description: `Your appointment with ${doctor.name} has been confirmed for ${formatDate(date)} at ${time}. However, confirmation email could not be sent.`,
          variant: "default"
        });
      }

      setIsOpen(false);
      form.reset();
      onBookingSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const [, date, time] = selectedSlot ? selectedSlot.split('|') : ['', '', ''];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full" 
          disabled={!selectedSlot}
        >
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        
        {selectedSlot && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Appointment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-bold text-green-600 flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {doctor.consultation_fee}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleBookAppointment)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              rules={{ required: "Patient name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientEmail"
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              You'll receive confirmation via email
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
