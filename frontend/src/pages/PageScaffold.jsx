import { PageHeader } from "../components/common";

export default function PageScaffold({ title, subtitle = "Module ready." }) {
  return (
    <section>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="card">
        <p>This section is available in navigation and can be extended with your project-specific workflows.</p>
      </div>
    </section>
  );
}
