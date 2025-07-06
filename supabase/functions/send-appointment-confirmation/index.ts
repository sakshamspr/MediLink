
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  doctorName: string;
  patientEmail: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationFee: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      doctorName, 
      patientEmail, 
      patientName, 
      appointmentDate, 
      appointmentTime, 
      consultationFee 
    }: AppointmentEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "MediLink <onboarding@resend.dev>",
      to: [patientEmail],
      subject: "Appointment Confirmation - MediLink",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">MediLink</h1>
            <p style="margin: 5px 0 0 0;">Your Health, Our Priority</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">Appointment Confirmed!</h2>
            
            <p>Dear ${patientName},</p>
            
            <p>Your appointment has been successfully booked. Here are the details:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Doctor:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${doctorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${appointmentDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Time:</td>
                  <td style="padding: 8px 0; color: #6b7280;">${appointmentTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Consultation Fee:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: bold;">₹${consultationFee}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time. Bring a valid ID and any relevant medical documents.</p>
            </div>
            
            <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance.</p>
            
            <p>Thank you for choosing MediLink for your healthcare needs.</p>
            
            <p>Best regards,<br>The MediLink Team</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">© 2024 MediLink. Making healthcare accessible for everyone.</p>
          </div>
        </div>
      `,
    });

    console.log("Appointment confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending appointment confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
