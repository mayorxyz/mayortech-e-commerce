import emailjs from "emailjs-com";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

export async function sendOrderEmail(params: {
  productName: string;
  customerName: string;
  phone: string;
  email: string;
}) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        product_name: params.productName,
        customer_name: params.customerName,
        customer_phone: params.phone,
        customer_email: params.email,
      },
      PUBLIC_KEY
    );
  } catch (err) {
    console.error("EmailJS error:", err);
  }
}
