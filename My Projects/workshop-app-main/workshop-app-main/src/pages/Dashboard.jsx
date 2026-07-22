import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import DashboardCards from "../components/DashboardCards";
import ParticipantTable from "../components/ParticipantTable";

const STORAGE_KEY = "workshopParticipants";

function Dashboard() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [workshopFilter, setWorkshopFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setParticipants(JSON.parse(saved));
      } catch (error) {
        console.warn("Unable to parse saved participants", error);
      }
    }
  }, []);

  const stats = useMemo(() => {
    const result = {
      total: participants.length,
      female: 0,
      male: 0,
      other: 0,
      workshops: {},
    };

    participants.forEach((participant) => {
      const gender = (participant.gender || "").toLowerCase();
      if (gender === "female") {
        result.female += 1;
      } else if (gender === "male") {
        result.male += 1;
      } else {
        result.other += 1;
      }

      const workshop = participant.workshop || "Other";
      result.workshops[workshop] = (result.workshops[workshop] || 0) + 1;
    });

    return result;
  }, [participants]);

  const workshops = useMemo(
    () => Array.from(new Set(participants.map((participant) => participant.workshop))).sort(),
    [participants]
  );

  const genderData = useMemo(
    () => [
      { name: "Female", value: stats.female },
      { name: "Male", value: stats.male },
      { name: "Other", value: stats.other },
    ],
    [stats.female, stats.male, stats.other]
  );

  const workshopData = useMemo(
    () =>
      Object.entries(stats.workshops).map(([workshop, count]) => ({
        workshop,
        count,
      })),
    [stats.workshops]
  );

  const hasParticipantData = participants.length > 0;
  const filteredParticipants = useMemo(
    () =>
      participants.filter((participant) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          [participant.name, participant.email, participant.phone, participant.workshop, participant.gender]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term));
        const matchesGender = genderFilter === "All" || participant.gender === genderFilter;
        const matchesWorkshop = workshopFilter === "All" || participant.workshop === workshopFilter;
        return matchesSearch && matchesGender && matchesWorkshop;
      }),
    [participants, search, genderFilter, workshopFilter]
  );

  return (
    <section className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Workshop Registration</h1>
        </div>
        <Link to="/" className="secondary-button">
          Add Participant
        </Link>
      </div>

      <div className="chart-grid">
        <article className="chart-card">
          <header>
            <h2>Gender distribution</h2>
          </header>
          {hasParticipantData ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={6}>
                    {genderData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.name === "Female" ? "#38bdf8" : entry.name === "Male" ? "#818cf8" : "#f59e0b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.08)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-chart">Add participants first to display the gender chart.</div>
          )}
        </article>

        <article className="chart-card">
          <header>
            <h2>Workshop attendance</h2>
          </header>
          {hasParticipantData ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={workshopData} margin={{ top: 24, right: 16, left: 0, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
                  <XAxis dataKey="workshop" tick={{ fill: "#cbd5e1", fontSize: 12 }} interval={0} angle={-20} textAnchor="end" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#cbd5e1" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(255,255,255,0.08)" }} />
                  <Bar dataKey="count" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-chart">Add participants first to display the workshop chart.</div>
          )}
        </article>
      </div>

      <DashboardCards stats={stats} />
    </section>
  );
}

export default Dashboard;
