import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Facebook, Linkedin, Twitter, Loader2, Mail } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  bio: string | null;
  image: string | null;
  is_active: boolean | null;
  display_order: number | null;
  team_category: string | null;
  social_facebook: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
};

const SocialLinks = ({ member }: { member: TeamMember }) => (
  <div className="flex items-center justify-center gap-3 mt-5">
    {member.social_facebook && (
      <a
        href={member.social_facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:scale-110"
        aria-label={`${member.name} on Facebook`}
      >
        <Facebook className="h-4 w-4" />
      </a>
    )}
    {member.social_linkedin && (
      <a
        href={member.social_linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:scale-110"
        aria-label={`${member.name} on LinkedIn`}
      >
        <Linkedin className="h-4 w-4" />
      </a>
    )}
    {member.social_twitter && (
      <a
        href={member.social_twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:scale-110"
        aria-label={`${member.name} on Twitter`}
      >
        <Twitter className="h-4 w-4" />
      </a>
    )}
  </div>
);

const MemberCard = ({ member, onViewDetails }: { member: TeamMember; onViewDetails?: (member: TeamMember) => void }) => {
  const initials = (member.name || "").trim().slice(0, 1).toUpperCase();
  const isClickable = Boolean(onViewDetails);

  const CardContent = () => (
    <>
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-secondary/60">
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          {member.image ? (
            <>
              <img
                src={member.image}
                alt={`${member.name} - ${member.designation}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
              <div className="h-24 w-24 rounded-full bg-primary/20 ring-2 ring-primary/30 flex items-center justify-center">
                <span className="text-4xl font-serif font-semibold text-primary">
                  {initials}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 text-center">
        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
          {member.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-primary uppercase tracking-wide">{member.designation}</p>
        <SocialLinks member={member} />
      </div>
    </>
  );

  return (
    <article className={`group overflow-hidden rounded-xl border border-border/40 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50 ${isClickable ? 'cursor-pointer' : ''}`}>
      {isClickable ? (
        <button
          type="button"
          onClick={() => onViewDetails?.(member)}
          className="w-full text-left"
        >
          <CardContent />
        </button>
      ) : (
        <CardContent />
      )}
    </article>
  );
};

const TeamSection = ({
  eyebrow,
  title,
  description,
  members,
  tone = "default",
  onViewDetails,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  members: TeamMember[];
  tone?: "default" | "muted";
  onViewDetails?: (member: TeamMember) => void;
}) => {
  if (members.length === 0) return null;

  return (
    <section className={tone === "muted" ? "section-padding bg-secondary/30" : "section-padding"}>
      <div className="container-custom px-4 md:px-0">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">{eyebrow}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
          {description && <p className="mt-4 text-sm sm:text-base text-muted-foreground">{description}</p>}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} onViewDetails={onViewDetails} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Management = () => {
  // Fetch team members
  const { data: teamMembers, isLoading: isTeamLoading } = useQuery({
    queryKey: ["team-members-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("management_team")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  // Fetch SEO dynamically
  const { data: seoData } = useQuery({
    queryKey: ["page-seo-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .match({ page_slug: "about/management" })
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch site settings (favicon)
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("favicon_url").single();
      return data;
    },
  });

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const handleOpenMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  const handleCloseMember = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  const boardMembers = teamMembers?.filter((m) => m.team_category === "board") || [];
  const seniorManagement = teamMembers?.filter((m) => m.team_category === "senior_management") || [];
  const team = teamMembers?.filter((m) => m.team_category === "team" || !m.team_category) || [];

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        {/* Page Title */}
        <title>{seoData?.page_title || "Management Team"}</title>

        {/* Meta Description */}
        <meta
          name="description"
          content={
            seoData?.meta_description ||
            "Meet DADL's management team: board of directors, senior leaders, and team members."
          }
        />

        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData?.page_title || "Management Team"} />
        <meta
          property="og:description"
          content={
            seoData?.meta_description ||
            "Meet DADL's management team: board of directors, senior leaders, and team members."
          }
        />
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}

        {/* Favicon from site settings */}
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}

        {/* Canonical URL */}
        <link rel="canonical" href={seoData ? `/${seoData.page_slug}` : "/about/management"} />
      </Helmet>

      <Navbar />

      <main className="pt-36">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#071827] text-white py-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),transparent_30%)]" />
          <div className="container-custom relative px-4 md:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">Management Team</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl">
              The people behind our projects—focused on quality, delivery, and long-term trust.
            </p>
          </div>
        </section>

        {/* Team Sections */}
        {isTeamLoading ? (
          <section className="section-padding">
            <div className="container-custom flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Loading team members...</span>
            </div>
          </section>
        ) : (
          <>
            <TeamSection
              eyebrow="Leadership"
              title="Board of Directors"
              description="Strategic guidance and governance for long-term growth."
              members={boardMembers}
              onViewDetails={handleOpenMember}
            />
            <TeamSection
              eyebrow="Operations"
              title="Senior Management"
              description="Experienced leaders who execute with speed and precision."
              members={seniorManagement}
              tone="muted"
            />
            <TeamSection
              eyebrow="People"
              title="The Team"
              description="A dedicated group delivering great homes and better experiences."
              members={team}
            />

            {/* Info Box */}
            <section className="py-12 md:py-16">
              <div className="container-custom px-4 md:px-0">
                <div className="mx-auto max-w-3xl rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-8 md:p-10 text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-1 w-8 bg-primary rounded-full" />
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="h-1 w-8 bg-primary rounded-full" />
                  </div>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    Our team brings together decades of real estate development, construction, and customer service experience—<span className="font-semibold text-primary">built on transparency and results</span>.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Dialog
        open={isMemberModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseMember();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedMember?.image && (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                />
              )}
              <div>
                <DialogTitle className="text-2xl">{selectedMember?.name}</DialogTitle>
                <DialogDescription className="text-sm font-semibold text-primary mt-1 uppercase tracking-wide">
                  {selectedMember?.designation}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedMember && (
            <div className="mt-4">
              <div className="rounded-lg border border-border/40 bg-secondary/30 p-6">
                <p className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                  {selectedMember.bio || "No message available."}
                </p>
              </div>
              {selectedMember.bio && (
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <span>Message from leadership</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Management;
