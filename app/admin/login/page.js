import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLogin() {
  return (
    <div className="admin-login-page">
      <div className="admin-login">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <h1>Admin sign in</h1>
        <p className="sub">Life Secret Plus dashboard</p>
        <LoginForm />
      </div>
    </div>
  );
}
