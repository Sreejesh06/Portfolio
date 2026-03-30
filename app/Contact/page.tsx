"use client";

import Container from "@/components/containers";
import { Github, Linkedin, Twitter } from "lucide-react";
import DisplacementText from "@/components/ui/displacement-text";
import { toast } from "sonner";
import { FlightButton } from "@/components/ui/flight-button";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const isFormValid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.message.trim() !== "";

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/ajax/its.sreejesh.dev@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Message sent! I'll get back to you soon.");
        form.reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <Container className="min-h-[200vh] px-8 pt-24 md:p-20 md:pb-10 mx-auto">
        {/* Background Pattern & Borders */}
        <div
          className="absolute right-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
          bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
          bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
        ></div>

        <div
          className="absolute left-0 top-0 h-full w-6 border-x border-x-(--pattern-fg) 
          bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]
          bg-size-[10px_10px] bg-fixed opacity-80 dark:opacity-12"
        ></div>

        <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-semibold text-3xl tracking-tight">
          <span className="link--elara">Contact</span>
        </h1>
        <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mt-2 mb-12">
          Open to internships, collaboration opportunities, and product-focused engineering work.
        </p>



        <div className="w-full max-w-2xl p-0 md:p-0 relative z-10">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* FormSubmit Configuration */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_subject" value="New Submission from Portfolio" />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 font-custom2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Sreejesh S"
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent outline-none transition-all font-custom2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 font-custom2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Sreejesh@example.com"
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent outline-none transition-all font-custom2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 font-custom2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your role, project, or collaboration idea."
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:border-transparent outline-none transition-all font-custom2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 resize-none"
              />
            </div>

            <div className="flex justify-center w-full">
              <FlightButton type="submit" className="w-32" disabled={isSubmitting || !isFormValid} />
            </div>
          </form>

          <div className="mt-10   flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-custom2">
            <div className="flex items-center gap-2">
              <p>Sreejesh</p>
            </div>

            {/* Displacement Text - Visible and Hoverable */}
            {/* Displacement Text - Visible and Hoverable */}

            <div className="flex items-center gap-4">
              <a href="https://x.com/Sreejesh_2006" target="_blank" rel="noopener noreferrer">
                <Twitter size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
              <a href="https://www.linkedin.com/in/sreejesh-/" target="_blank" rel="noopener noreferrer">
                <Linkedin size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
              <a href="https://github.com/Sreejesh06" target="_blank" rel="noopener noreferrer">
                <Github size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>




        <div className="w-full h-96 relative overflow-hidden flex items-center justify-center -mt-20">
          <DisplacementText
            text="SREEJESH"
            fontSize={300}
            className="h-full w-full"
            lightColor="#171717"
            darkColor="#e5e5e5"
          />
        </div>

      </Container>
    </div>
  );
}
