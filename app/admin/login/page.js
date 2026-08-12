import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLogin() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="admin-login">
          <span className="eyebrow center">Life Secret Plus</span>
          <h1 style={{ fontSize: "1.9rem", textAlign: "center", marginBottom: "1.75rem" }}>
            Admin sign in
          </h1>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
