import Container from "@/components/containers";

export default function ResumePage() {
  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <Container className="min-h-[100vh] px-8 pt-24 md:p-20 md:pb-10 mx-auto flex flex-col items-center">

        {/* RIGHT BORDER */}
        <div
          className="absolute right-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
            bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
            bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
        ></div>

        {/* LEFT BORDER */}
        <div
          className="absolute left-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
            bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
            bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
        ></div>

        <div className="w-full flex justify-between items-center mb-6 relative z-10">
          <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
            <span className="link--elara">Resume</span>
          </h1>
          <a 
            href="/Sreejesh_Resume.pdf" 
            download="Sreejesh_Resume.pdf"
            className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Download PDF
          </a>
        </div>

        <div className="w-full flex-1 min-h-[85vh] h-full rounded-xl overflow-hidden border border-[var(--pattern-fg)] shadow-2xl relative z-10 bg-white dark:bg-neutral-900">
          <iframe 
            src="/Sreejesh_Resume.pdf#view=FitH" 
            className="w-full h-full min-h-[85vh] border-none"
            title="Sreejesh Resume"
          />
        </div>
      </Container>
    </div>
  );
}
