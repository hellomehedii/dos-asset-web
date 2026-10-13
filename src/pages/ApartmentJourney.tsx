import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Clock3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./ApartmentJourney.css";

const ApartmentJourney = () => (
  <>
    <Helmet>
      <title>From Apartment Booking to Handover | DADL</title>
      <meta
        name="description"
        content="Information about DADL's apartment booking and handover process."
      />
      <link
        rel="canonical"
        href={`${window.location.origin}/apartment-to-handover`}
      />
    </Helmet>

    <Navbar />
    <main className="apartment-journey">
      <section className="apartment-hero">
        <div className="apartment-container">
          <p className="apartment-eyebrow">
            <span aria-hidden="true" />
            Apartment ownership
          </p>
          <h1>From Apartment Booking to Handover</h1>
          <p className="apartment-bangla-title" lang="bn">
            অ্যাপার্টমেন্ট বুকিং থেকে হ্যান্ডওভার পর্যন্ত
          </p>
          <p className="apartment-intro">
            We are preparing a dedicated guide to the apartment booking and
            handover journey. Project-specific terms and procedures will be
            shared here when available.
          </p>
          <p className="apartment-intro apartment-intro-bangla" lang="bn">
            অ্যাপার্টমেন্ট বুকিং থেকে হ্যান্ডওভার পর্যন্ত প্রতিটি ধাপ নিয়ে
            আলাদা নির্দেশিকা প্রস্তুত করা হচ্ছে। প্রকল্পভিত্তিক শর্ত ও প্রক্রিয়া
            জানা গেলে এখানে প্রকাশ করা হবে।
          </p>

          <section className="apartment-status" aria-labelledby="apartment-status-title">
            <div className="apartment-status-icon" aria-hidden="true">
              <Building2 size={22} />
            </div>
            <div>
              <h2 id="apartment-status-title">Apartment process guide in progress</h2>
              <p lang="bn">
                অ্যাপার্টমেন্টের জন্য নিজস্ব প্রক্রিয়ার ধাপগুলো এখনো যুক্ত করা
                হয়নি। ( Comming soon )
              </p>
            </div>
            <Clock3
              className="apartment-status-clock"
              size={18}
              aria-hidden="true"
            />
          </section>

          <div className="apartment-actions">
            <Link to="/projects" className="apartment-primary-button">
              Explore Our Projects
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/contact" className="apartment-secondary-button">
              Contact DADL
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ApartmentJourney;
