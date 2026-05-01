function Footer() {
  return (
    <footer className="w-full border-t border-ink-base/8 mt-16">
      <div className="max-w-container mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <p className="text-sm text-ink-subtle">
          © {new Date().getFullYear()} Khushal Automation Agency. All rights
          reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-ink-muted">
          <a
            href="mailto:khushalchandpa7@gmail.com"
            className="hover:text-ink-base transition-colors"
          >
            khushalchandpa7@gmail.com
          </a>
          <a href="#contact" className="hover:text-ink-base transition-colors">
            Book a call
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
