import { requireAuth } from "@/lib/auth";
import { getPageSection } from "@/lib/cms/page-sections";
import { saveContactSectionAction } from "../actions";
import { ContactSectionForm } from "@/components/admin/contact-section-form";
import Link from "next/link";
import { Phone } from "lucide-react";

export const metadata = { title: "Edit Contact — IC IITP Admin" };

const DEFAULTS = {
  address: "Incubation Centre, IIT Patna\nAmhara Road, Bihta\nPatna, Bihar – 801103",
  phone: "+91 611 523 3547",
  email: "icitp@iitp.ac.in",
  hours: "Monday – Friday: 9:00 AM – 5:30 PM IST",
  maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.4!2d84.851!3d25.519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sIIT+Patna%2C+Bihta%2C+Bihar!5e0!3m2!1sen!2sin!4v1",
};

export default async function ContactEditorPage() {
  await requireAuth();
  const cms = await getPageSection("contact").catch(() => null);

  const current = {
    address:        cms?.address        || DEFAULTS.address,
    phone:          cms?.phone          || DEFAULTS.phone,
    email:          cms?.email          || DEFAULTS.email,
    hours:          cms?.hours          || DEFAULTS.hours,
    maps_embed_url: cms?.maps_embed_url || DEFAULTS.maps_embed_url,
  };

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/pages" className="text-sm" style={{ color: "#7a8e6a" }}>← Pages</Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Phone className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black" style={{ color: "#1c2e06" }}>Edit Contact Page</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#7a8e6a" }}>
        Changes appear live on <a href="/contact" target="_blank" className="underline">/contact</a>.
      </p>
      <ContactSectionForm current={current} onSave={saveContactSectionAction} />
    </main>
  );
}
