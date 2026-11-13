"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { getSingleJob, updateJob } from "@/services/recruiterService";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";
import GlassCard from "@/components/ui/GlassCard";
import FormSection from "@/components/ui/FormSection";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import SkillInput from "@/components/ui/SkillInput";
import AIInfoCard from "@/components/ui/AIInfoCard";
import FormButton from "@/components/ui/FormButton";

export default function EditJobPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: "",

    company: "",

    location: "",

    package: "",

    description: "",

    deadline: "",
  });

  const fetchJob = useCallback(async () => {
    try {
      const data = await getSingleJob(id);

      setSkills(data.skillsRequired || []);

      setFormData({
        title: data.title,

        company: data.company,

        location: data.location,

        package: data.package,

        description: data.description,

        deadline: data.deadline ? data.deadline.substring(0, 10) : "",
      });
    } catch (error) {
      toast.error("Failed to load job.");

      router.push("/recruiter/jobs");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id, fetchJob]);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      await updateJob(
        id,

        {
          ...formData,

          skillsRequired: skills,
        },
      );

      toast.success("Job Updated Successfully");

      router.push("/recruiter/jobs");
    } catch (error) {
      toast.error("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="py-40 text-center text-gray-400 text-xl">
          Loading Job...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <HeroBanner
          title="Edit Job Opportunity"
          subtitle="Modify job details and keep your hiring pipeline updated with the latest information."
          buttonText="Back to Jobs"
          onClick={() => router.push("/recruiter/jobs")}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <GlassCard>
            <FormSection
              title="Basic Information"
              subtitle="Update the essential details of this opportunity."
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Frontend Developer"
                  required
                />

                <FormInput
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Google"
                  required
                />

                <FormInput
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  required
                />

                <FormInput
                  label="Package (LPA)"
                  type="number"
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  placeholder="18"
                  required
                />

                <FormInput
                  label="Application Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="md:col-span-2"
                />
              </div>
            </FormSection>
          </GlassCard>
          <GlassCard>
            <FormSection
              title="Job Description"
              subtitle="Explain the responsibilities, requirements and expectations for this role."
            >
              <FormTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed job description..."
                required
              />
            </FormSection>
          </GlassCard>

          <GlassCard>
            <FormSection
              title="Required Skills"
              subtitle="Add one skill at a time. Press Enter after each skill."
            >
              <SkillInput skills={skills} setSkills={setSkills} />
            </FormSection>
          </GlassCard>

          <AIInfoCard
            title="AI Candidate Matching"
            description="Updating the required skills and job description helps PlaceMentor AI provide more accurate candidate recommendations."
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/recruiter/jobs")}
              className="
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                px-8
                                py-4
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:border-[#C97B3C]/40
                                hover:bg-white/10
                            "
            >
              Cancel
            </button>

            <div className="sm:w-64">
              <FormButton type="submit" loading={saving}>
                Update Job
              </FormButton>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
