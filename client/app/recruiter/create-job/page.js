"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import toast from "react-hot-toast";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";
import GlassCard from "@/components/ui/GlassCard";

import FormSection from "@/components/ui/FormSection";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import SkillInput from "@/components/ui/SkillInput";
import AIInfoCard from "@/components/ui/AIInfoCard";
import FormButton from "@/components/ui/FormButton";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",

    company: "",

    location: "",

    package: "",

    description: "",

    deadline: "",
  });

  const todayDate = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.deadline) {
      toast.error("Please select an application deadline.");
      return;
    }

    const parsedDeadline = new Date(`${formData.deadline}T23:59:59`);
    if (
      Number.isNaN(parsedDeadline.getTime()) ||
      formData.deadline < todayDate
    ) {
      toast.error("Application deadline must be today or a future date.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/jobs", {
        ...formData,
        deadline: parsedDeadline.toISOString(),
        skillsRequired: skills,
      });

      toast.success("Job Published Successfully");

      router.push("/recruiter/jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-10">
        <HeroBanner
          title="Create New Opportunity"
          subtitle="Publish a new opportunity and let PlaceMentor AI recommend the most suitable candidates."
          buttonText="Manage Jobs"
          onClick={() => router.push("/recruiter/jobs")}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <GlassCard>
            <FormSection
              title="Basic Information"
              subtitle="Enter the primary information about the job."
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  label="Job Title"
                  name="title"
                  placeholder="Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Company"
                  name="company"
                  placeholder="Google"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Location"
                  name="location"
                  placeholder="Bangalore"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Package (LPA)"
                  name="package"
                  type="number"
                  placeholder="18"
                  value={formData.package}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Application Deadline"
                  name="deadline"
                  type="date"
                  min={todayDate}
                  value={formData.deadline}
                  onChange={handleChange}
                  className="md:col-span-2"
                  required
                />
              </div>
            </FormSection>
          </GlassCard>
          <GlassCard>
            <FormSection
              title="Job Description"
              subtitle="Describe the role, responsibilities and expectations."
            >
              <FormTextarea
                label="Description"
                name="description"
                placeholder="Write a detailed job description..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </FormSection>
          </GlassCard>

          <GlassCard>
            <FormSection
              title="Required Skills"
              subtitle="Add one skill at a time and press Enter."
            >
              <SkillInput skills={skills} setSkills={setSkills} />
            </FormSection>
          </GlassCard>

          <AIInfoCard
            title="AI Candidate Matching"
            description="Jobs with complete descriptions and accurate required skills receive better AI recommendations and improve candidate matching."
          />

          <FormButton type="submit" loading={loading}>
            Publish Job
          </FormButton>
        </form>
      </div>
    </PageContainer>
  );
}
