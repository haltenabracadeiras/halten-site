import { BannerForm } from "../BannerForm";
import { createBanner } from "../actions";

export default function NewBannerPage() {
  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Novo Banner
      </h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <BannerForm action={createBanner} isNew />
      </div>
    </div>
  );
}
