import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Facebook, Linkedin, Twitter } from "lucide-react";

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
  <div className="flex items-center justify-center gap-2 mt-4">
    {member.social_facebook && (
      <a
        href={member.social_facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
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
      <div className="relative aspect-square bg-secondary">
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
          {member.image ? (
            <img
              src={member.image}
              alt={`${member.name} - ${member.designation}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-background/70 ring-1 ring-border flex items-center justify-center">
                <span className="text-2xl font-serif font-semibold text-foreground">
                  {initials}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/60" />
      </div>

      <div className="p-5 text-center">
        <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-primary">{member.designation}</p>
        <SocialLinks member={member} />
      </div>
    </>
  );

  return (
    <article className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isClickable ? 'cursor-pointer' : ''}`}>
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
    <section className={tone === "muted" ? "section-padding bg-secondary" : "section-padding"}>
      <div className="container-custom">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wider uppercase text-primary">{eyebrow}</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="container-custom text-center text-muted-foreground">
              Loading team...
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
            <section className="pb-16">
              <div className="container-custom">
                <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    Our team brings together decades of real estate development, construction, and customer service experience—built on transparency and results.
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
            <DialogTitle>Message from {selectedMember?.designation}</DialogTitle>
            <DialogDescription>
              {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                  {selectedMember.bio || "No message available."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Management;
