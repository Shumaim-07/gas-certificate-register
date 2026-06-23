import { useState } from "react";
import { Link } from "react-router-dom";
import { RequestModal } from "../components/RequestModal";
import { useAuth } from "../context/AuthContext";
import flameImg from "../assets/flame.png";

const FAQ_ITEMS = [
  {
    q: "Will it look like the paper certificate landlords expect?",
    a: "Yes. The digital CP12 uses the exact same layout and fields as the paper form. Landlords and tenants receive a professional PDF that looks identical to what they're used to seeing.",
  },
  {
    q: "Do I need a Gas Safe registration number?",
    a: "Yes. You'll need your Gas Safe registration number to issue certificates. This ensures all certificates are issued by qualified engineers.",
  },
  {
    q: "What does it cost?",
    a: "We offer flexible pricing plans to suit engineers of all sizes. Sign up to see current pricing.",
  },
  {
    q: "Can I access old certificates?",
    a: "Yes. All certificates are stored securely in the cloud and can be accessed, downloaded, or re-sent at any time.",
  },
];

function LogoIcon({ size = 28 }: { size?: number; darkBg?: boolean }) {
  return <img src={flameImg} width={size} height={size} alt="" style={{ display: "block" }} />;
}

export function LandingPage() {
  const { role } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  return (
    <div className="lp">
      {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} />}

      {/* ── NAVBAR ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand">
            <LogoIcon />
            <span className="lp-brand-name">GasCertify UK</span>
          </Link>

          <div className="lp-nav-links">
            <a href="#problem" className="lp-nav-link">
              Why digital
            </a>
            <a href="#features" className="lp-nav-link">
              Features
            </a>
            <a href="#how-it-works" className="lp-nav-link">
              How it works
            </a>
            <a href="#faq" className="lp-nav-link">
              FAQ
            </a>
          </div>

          <div className="lp-nav-actions">
  {role === 'engineer' ? (
    <Link to="/dashboard" className="lp-nav-cta">
      Dashboard →
    </Link>
  ) : (
    <>
      <Link to="/login" className="lp-nav-login">
        Log in
      </Link>
      <Link
        to="#"
        className="lp-nav-cta"
        onClick={(e) => {
          e.preventDefault();
          setShowRequestModal(true);
        }}
      >
        Get started
      </Link>
    </>
  )}
</div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-left">
            <span className="lp-badge">
              <span className="small-dot"></span>
              UK GAS SAFE COMPATIBLE
            </span>
            <h1 className="lp-hero-title">
              Gas Safety
              <br />
              Certificates, <span className="lp-mark">issued</span>
              <br />
              <span className="lp-mark">digitally</span> in minutes.
            </h1>
            <p className="lp-hero-sub">
              Modern problems need modern solutions. Stop scribbling on paper
              CP12 pads — create the exact same certificate online, sign it on
              your phone, and email it to your landlord or tenant instantly.
              Saved forever in the cloud.
            </p>
            <div className="lp-hero-btns">
              <button
                type="button"
                className="lp-btn-dark"
                onClick={() => setShowRequestModal(true)}
              >
                Request engineer access →
              </button>
              <Link to="/login" className="lp-btn-outline">
                Engineer login
              </Link>
            </div>
            <p className="lp-trust">TRUSTED • FAST • COMPLIANT • PAPERLESS</p>
          </div>

        <div className="lp-cert-wrapper">
  {/* Yellow background frame */}
  <div className="lp-cert-frame" />
  {/* White card */}
  <div className="lp-cert-card">
    {/* Header */}
    <div className="lp-cert-header">
      <div>
        <p className="lp-cert-label">Landlord / Homeowner Gas Safety Record</p>
        <p className="lp-cert-title">CP12 · Digital</p>
      </div>
      <span className="lp-cert-pass">Pass</span>
    </div>
    {/* Body */}
    <dl className="lp-cert-grid">
      <div className="lp-cert-field">
        <dt>Property</dt>
        <dd>14 Acacia Ave, London</dd>
      </div>
      <div className="lp-cert-field">
        <dt>Engineer</dt>
        <dd>J. Whitmore</dd>
      </div>
      <div className="lp-cert-field">
        <dt>Gas Safe №</dt>
        <dd>512-887</dd>
      </div>
      <div className="lp-cert-field">
        <dt>Issued</dt>
        <dd>16 Jun 2026</dd>
      </div>
      <div className="lp-cert-field">
        <dt>Appliances</dt>
        <dd>3 tested</dd>
      </div>
      <div className="lp-cert-field">
        <dt>Next due</dt>
        <dd>16 Jun 2027</dd>
      </div>
    </dl>
    {/* Footer */}
    <div className="lp-cert-footer">
      Signed digitally by J. Whitmore — emailed to landlord &amp; tenant.
    </div>
  </div>
</div>

        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="lp-problem" id="problem">
        <div className="lp-container">
          <p className="lp-eyebrow">MODERN PROBLEM. MODERN SOLUTION</p>
          <h2 className="lp-h2">
            Paper certificates belong in
            <br />
            the 1990s.
          </h2>
          <p className="lp-problem-body">
            The CP12 hasn't changed — but the way you produce it should.
            GasCertify gives you the <strong className="strong-2nd">exact same certificate</strong>,
            generated digitally, fully compliant, and delivered before you've
            packed up your tools.
          </p>
          <div className="lp-compare-cols">
            <div className="lp-col-old">
              <div className="lp-col-header">The old way 📋</div>
              <ul className="lp-old-list">
                <li>Paper pads that get lost or soaked</li>
                <li>Handwriting nobody can read</li>
                <li>Driving back to the office to file copies</li>
                <li>Re-issuing certificates landlords have misplaced</li>
                <li>Chasing tenants with paper in the post</li>
              </ul>
            </div>
            <div className="lp-col-new">
              <div className="lp-col-header">The GasCertify way ⚡</div>
              <ul className="lp-new-list">
                <li>Fill the same CP12 form on your phone</li>
                <li>Digital signature in one tap</li>
                <li>Emailed to landlord &amp; tenant instantly</li>
                <li>Auto-archived in the cloud forever</li>
                <li>Re-send any past certificate in 2 clicks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-features-hd">
            <div>
              <p className="lp-eyebrow">FEATURES</p>
              <h2 className="lp-h2 lp-features-h2">
                Everything you need.
                <br />
                Nothing you don't.
              </h2>
            </div>
            <p className="lp-features-aside">
              Built with UK Gas Safe engineers — for the way you actually work
              between boilers, lofts and tenant doorbells.
            </p>
          </div>
          <div className="lp-features-grid">
            {[
              {
                n: "01",
                title: "Official CP12 layout",
                desc: "Same fields, same structure as the paper certificate engineers know.",
              },
              {
                n: "02",
                title: "Smart auto-fill",
                desc: "Save properties and appliances — never re-enter the same data twice.",
              },
              {
                n: "03",
                title: "Digital signature",
                desc: "Sign with your finger on-site. Legally binding and timestamped.",
              },
              {
                n: "04",
                title: "Instant PDF & email",
                desc: "Auto-delivered to landlord and tenant the moment you tap Issue.",
              },
              {
                n: "05",
                title: "Cloud archive",
                desc: "Every certificate stored securely — pull it up years later in seconds.",
              },
              {
                n: "06",
                title: "Multi-engineer teams",
                desc: "Add your team, track who issued what, manage from one dashboard.",
              },
            ].map((f) => (
              <div key={f.n} className="lp-feat-card">
                <span className="lp-feat-num">{f.n}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-container">
          <p className="lp-eyebrow lp-eyebrow-y">HOW IT WORKS</p>
          <h2 className="lp-how-h2">
            From job booked to
            <br />
            certificate sent — three steps.
          </h2>
          <div className="lp-steps">
            {[
              {
                n: "01",
                title: "Sign up as an engineer",
                desc: "Add your Gas Safe number and company details. Takes under a minute.",
              },
              {
                n: "02",
                title: "Fill the form on-site",
                desc: "Open the digital CP12 on your phone. Tap through appliances, results and notes.",
              },
              {
                n: "03",
                title: "Issue & send",
                desc: "Sign, hit Issue. Landlord and tenant receive the certificate instantly.",
              },
            ].map((s) => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-n">{s.n}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCE ── */}
      <section className="lp-audience">
        <div className="lp-container lp-audience-inner">
          <h2 className="lp-audience-h2">
            Built for everyone in the gas safety chain.
          </h2>
          <div className="lp-audience-tags">
            {[
              "Gas Safe engineers",
              "Landlords",
              "Letting agents",
              "Property managers",
            ].map((t) => (
              <span key={t} className="lp-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-faq" id="faq">
        <div className="lp-container lp-faq-grid">
          <div className="lp-faq-left">
            <LogoIcon size={40} />
          </div>
          <div className="lp-faq-right">
            <p className="lp-eyebrow">FAQ</p>
            <h2 className="lp-h2">Questions, answered.</h2>
            <div className="lp-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="lp-faq-item">
                  <button
                    className="lp-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="lp-faq-icon">
                      {openFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === i && <div className="lp-faq-a">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-container lp-cta-inner">
          <h2 className="lp-cta-h2">Start issuing certificates today.</h2>
          <p className="lp-cta-sub">
            Join hundreds of UK engineers who've already binned the paper pad.
          </p>
          <div className="lp-cta-btns">
            <button
              type="button"
              className="lp-btn-dark"
              onClick={() => setShowRequestModal(true)}
            >
              Request engineer access →
            </button>
            <Link to="/login" className="lp-btn-outline-dark">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <LogoIcon size={24} darkBg />
              <span className="lp-footer-name">GasCertify UK</span>
            </div>
            <p className="lp-footer-tag">
              Digital Gas Safety Certificates for UK engineers, landlords
              <br />
              and letting agents. Modern, compliant, paperless.
            </p>
          </div>
          <div className="lp-footer-col">
            <h4>PRODUCT</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="lp-footer-col">
            <h4>ACCOUNT</h4>
            <Link to="/login">Log in</Link>
            <Link to="/login">Sign up</Link>
          </div>
        </div>
        <div className="lp-footer-copy">
          <p>
            © {new Date().getFullYear()} GasCertify UK. All rights reserved.
          </p>
          <p>
            Not affiliated with Gas Safe Register. Registered for Gas Safe
            engineers.
          </p>
        </div>
      </footer>
    </div>
  );
}
