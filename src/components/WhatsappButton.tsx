import { useSiteSettings } from "@/hooks/useSiteSettings";
import { MessageSquare } from "lucide-react";

const WhatsappButton = () => {
  const { data: settings } = useSiteSettings();
  const phone = settings?.phone ? settings.phone.replace(/[^\d+]/g, "") : "";
  const waHref = phone ? `https://wa.me/${phone.replace(/^\+/, "")}` : "#";

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact via WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-colors"
    >
      <MessageSquare className="w-6 h-6" />
    </a>
  );
};

export default WhatsappButton;
