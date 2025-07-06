
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
  // Handle CORS preflight requests
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

    console.log("Sending appointment confirmation emails to:", patientEmail, "and admin");

    const adminEmail = "sakshamspra@gmail.com";

    // Email template for patient
    const patientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🩺 MediLink</h1>
          <h2 style="margin: 10px 0 0 0; font-weight: normal;">Appointment Confirmed!</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="font-size: 18px; margin-bottom: 20px;">Hello ${patientName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your appointment has been successfully booked! Here are the details:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #1f2937;">📅 Appointment Details</h3>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Consultation Fee:</strong> ₹${consultationFee}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">📝 Important Notes:</h4>
            <ul style="margin: 10px 0; color: #92400e;">
              <li>Please arrive 15 minutes before your scheduled appointment</li>
              <li>Bring a valid ID and any relevant medical documents</li>
              <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
            We look forward to seeing you at your appointment. If you have any questions or need to make changes, 
            please don't hesitate to contact us.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              <strong>The MediLink Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    // Email template for admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🩺 MediLink Admin</h1>
          <h2 style="margin: 10px 0 0 0; font-weight: normal;">New Appointment Booked</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="font-size: 18px; margin-bottom: 20px;">Hello Admin,</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            A new appointment has been booked on MediLink. Here are the details:
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #1f2937;">📅 Appointment Details</h3>
            <p><strong>Patient Name:</strong> ${patientName}</p>
            <p><strong>Patient Email:</strong> ${patientEmail}</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Consultation Fee:</strong> ₹${consultationFee}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #6b7280; font-size: 14px;">
              MediLink Admin Notification System
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to patient
    const patientEmailResponse = await resend.emails.send({
      from: "MediLink <onboarding@resend.dev>",
      to: [patientEmail],
      subject: `Appointment Confirmed with ${doctorName}`,
      html: patientEmailHtml,
    });

    console.log("Patient email sent successfully:", patientEmailResponse);

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "MediLink <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Appointment Booked - ${doctorName}`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      patientEmail: patientEmailResponse,
      adminEmail: adminEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
