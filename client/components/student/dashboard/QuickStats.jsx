"use client";

import {
    FaBriefcase,
    FaCheckCircle,
    FaStar,
    FaCode,
} from "react-icons/fa";

import StatCard from "@/components/ui/StatCard";

export default function QuickStats({ dashboard }) {

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            <StatCard
                title="Applications"
                value={dashboard.stats.totalApplications}
                subtitle="Jobs Applied"
                icon={<FaBriefcase />}
                color="text-blue-400"
            />

            <StatCard
                title="Shortlisted"
                value={dashboard.stats.shortlisted}
                subtitle="Interview Ready"
                icon={<FaStar />}
                color="text-yellow-400"
            />

            <StatCard
                title="Selected"
                value={dashboard.stats.selected}
                subtitle="Offers Received"
                icon={<FaCheckCircle />}
                color="text-green-400"
            />

            <StatCard
                title="Skills"
                value={dashboard.stats.totalSkills}
                subtitle="Technical Skills"
                icon={<FaCode />}
                color="text-cyan-400"
            />

        </div>

    );

}