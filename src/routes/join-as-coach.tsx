import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/join-as-coach")({
  component: JoinAsCoachPage,
});

const SPORTS = [
  "Football",
  "Swimming",
  "Basketball",
  "Volleyball",
  "Karate",
  "Gymnastics",
  "Fitness",
];

const EXPERIENCE_LEVELS = ["1-2 Years", "3-5 Years", "5-10 Years", "10+ Years"];

const BRANCHES = [
  "Downtown Flagship (Central District)",
  "Riverside Complex (West Bank)",
  "Northgate Arena (North Hills)",
  "Coastal Center (Bayside)",
  "Eastside Hub (Old Town)",
  "Highlands Elite (The Highlands)",
];

function JoinAsCoachPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    sport: SPORTS[0],
    experience: EXPERIENCE_LEVELS[1],
    branch: BRANCHES[0],
    certifications: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{8,20}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.certifications.trim()) {
      newErrors.certifications = "Please list your certifications or license details";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Please share a brief coaching philosophy or biography";
    }

    if (!uploadedFile) {
      newErrors.file = "Please upload your resume/CV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (
        validTypes.includes(file.type) ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc")
      ) {
        setUploadedFile(file);
        if (errors.file) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.file;
            return next;
          });
        }
        toast.success(`Resume uploaded: ${file.name}`);
      } else {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      if (errors.file) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.file;
          return next;
        });
      }
      toast.success(`Resume uploaded: ${e.target.files[0].name}`);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields and upload your CV");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 bg-radial-[ellipse_at_top_right_oklch(0.75_0.2_55_/_0.08)_transparent_50%]" />
      <div className="absolute inset-0 -z-10 bg-radial-[ellipse_at_top_left_oklch(0.75_0.2_55_/_0.06)_transparent_50%]" />

      {/* Navbar */}
      <header className="py-6 border-b border-white/5 backdrop-blur-xl bg-background/70 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Trophy className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            APEX<span className="text-gradient">.</span>
          </Link>
          <Link to="/" className="btn-ghost text-sm py-2 px-4 gap-2 flex items-center">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header Title */}
              <div className="text-center mb-12">
                <span className="eyebrow mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-[oklch(0.85_0.13_60)]" />
                  Careers at Apex
                </span>
                <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mt-3">
                  Join us as a <span className="text-gradient">Coach</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
                  Apex is looking for world-class mentors to develop the next generation of elite
                  athletes. Complete the application below, and our athletic directors will review
                  your profile.
                </p>
              </div>

              {/* Form Card */}
              <form
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top right, oklch(0.75 0.2 55 / 0.12), transparent 60%)",
                  }}
                />

                <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-gradient" />
                  Coach Application Form
                </h3>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="fullName"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`w-full rounded-xl border bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 ${
                        errors.fullName
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. coach@apex.com"
                      className={`w-full rounded-xl border bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 ${
                        errors.email ? "border-red-500/50 focus:border-red-500" : "border-white/10"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="phone"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 000-0000"
                      className={`w-full rounded-xl border bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 ${
                        errors.phone ? "border-red-500/50 focus:border-red-500" : "border-white/10"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Specialty Sport */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="sport"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Specialty Sport <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 [&_option]:bg-[#141517] [&_option]:text-white"
                    >
                      {SPORTS.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="experience"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 [&_option]:bg-[#141517] [&_option]:text-white"
                    >
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Branch */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="branch"
                      className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                    >
                      Preferred Branch Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 [&_option]:bg-[#141517] [&_option]:text-white"
                    >
                      {BRANCHES.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Certifications and Licences */}
                <div className="flex flex-col gap-2 mb-6">
                  <label
                    htmlFor="certifications"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    Certifications & Licenses <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    rows={4}
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="List relevant athletic/coaching certifications (e.g., UEFA B License, ASCA Level 3, Red Cross CPR/AED)"
                    className={`w-full resize-none rounded-xl border bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 ${
                      errors.certifications
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10"
                    }`}
                  />
                  {errors.certifications && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                      {errors.certifications}
                    </span>
                  )}
                </div>

                {/* Short Bio / Coaching Philosophy */}
                <div className="flex flex-col gap-2 mb-8">
                  <label
                    htmlFor="bio"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-semibold"
                  >
                    Bio & Coaching Philosophy <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your approach to development, motivation, and athletic growth..."
                    className={`w-full resize-none rounded-xl border bg-black/20 px-4 py-3.5 outline-none transition-all duration-300 focus:border-white/30 focus:bg-black/40 ${
                      errors.bio ? "border-red-500/50 focus:border-red-500" : "border-white/10"
                    }`}
                  />
                  {errors.bio && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                      {errors.bio}
                    </span>
                  )}
                </div>

                {/* File Upload Zone */}
                <div className="flex flex-col gap-2 mb-10">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Resume / CV (PDF or DOCX) <span className="text-red-500">*</span>
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? "border-[oklch(0.75_0.2_55)] bg-[oklch(0.75_0.2_55_/_0.06)]"
                        : uploadedFile
                          ? "border-green-500/40 bg-green-500/5"
                          : errors.file
                            ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
                            : "border-white/10 hover:border-white/20 bg-black/10"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                    />

                    <AnimatePresence mode="wait">
                      {uploadedFile ? (
                        <motion.div
                          key="uploaded"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center gap-4 w-full max-w-md bg-black/40 border border-white/5 rounded-xl p-4"
                        >
                          <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-500/10 text-green-500">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            aria-label="Remove resume"
                            className="p-2.5 rounded-lg border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload-prompt"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center flex flex-col items-center"
                        >
                          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 border border-white/5 mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">
                            <span className="text-gradient font-semibold">Click to upload</span> or
                            drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            PDF, DOCX, or DOC (Max 10MB)
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {errors.file && (
                    <span className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                      {errors.file}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-base py-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-8 md:p-16 text-center max-w-2xl mx-auto"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-8">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Application Received!
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Thank you for applying to join the coaching team at Apex Sports Academy. Our
                athletic director will review your qualifications, experience, and certifications
                and contact you in 3-5 business days.
              </p>

              <div className="mt-8 border-t border-white/5 pt-8 text-left max-w-md mx-auto space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applicant Name:</span>
                  <span className="font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Specialty Sport:</span>
                  <span className="font-semibold text-gradient">{formData.sport}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location Preference:</span>
                  <span className="font-semibold truncate max-w-[200px]">
                    {formData.branch.split(" (")[0]}
                  </span>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn-primary px-8">
                  Return to Home
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      sport: SPORTS[0],
                      experience: EXPERIENCE_LEVELS[1],
                      branch: BRANCHES[0],
                      certifications: "",
                      bio: "",
                    });
                    setUploadedFile(null);
                  }}
                  className="btn-ghost px-8"
                >
                  Submit Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center mt-12 bg-black/20">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Apex Sports Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
