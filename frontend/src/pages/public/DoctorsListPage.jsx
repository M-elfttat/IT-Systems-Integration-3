import { useEffect, useState } from "react";
import { DoctorCard, EmptyState, ErrorAlert, FilterPanel, LoadingSpinner, PageHeader, SearchBar } from "../../components/common";
import { doctorService } from "../../services/doctorService";

export default function DoctorsListPage() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    doctorService.list(search ? { specialization: search } : {})
      .then((data) => {
        setAllDoctors(data);
        const filtered = data.filter((d) => {
          const bySpecialization = selectedSpecialization ? d.specialization === selectedSpecialization : true;
          const byAvailability = availabilityOnly ? Boolean(d.availability_note) : true;
          return bySpecialization && byAvailability;
        });
        setItems(filtered);
      })
      .catch((e) => setError(e?.response?.data?.message || "Failed to load doctors"))
      .finally(() => setLoading(false));
  }, [search, selectedSpecialization, availabilityOnly]);

  const specializations = [...new Set(allDoctors.map((d) => d.specialization).filter(Boolean))];

  return (
    <section>
      <PageHeader title="Available Doctors" subtitle="Search by specialization and availability" />
      <FilterPanel>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search specialization..." />
        <label>
          Specialization
          <select value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
            <option value="">All</option>
            {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={availabilityOnly} onChange={(e) => setAvailabilityOnly(e.target.checked)} />
          Show doctors with listed availability only
        </label>
      </FilterPanel>
      <ErrorAlert text={error} />
      {loading ? <LoadingSpinner /> : !items.length ? <EmptyState text="No doctors found." /> : <div className="grid3">{items.map((d) => <DoctorCard key={d.doctor_id} doctor={d} />)}</div>}
    </section>
  );
}
