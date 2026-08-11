import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "LifeSecret Plus shares practical, evidence-based mental health and wellbeing guidance for everyday life.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>About LifeSecret Plus</h1>
          <p>
            We turn research on mental health and wellbeing into small, doable
            steps you can use today.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="wrap">
          <div className="prose">
            <h2>Why we started</h2>
            <p>
              Good mental health advice is often buried in clinical language or
              lost in noisy social feeds. We started LifeSecret Plus to make it
              plain: what actually helps, why it works, and how to fit it into a
              normal, busy day.
            </p>

            <h2>What we believe</h2>
            <ul>
              <li>
                <strong>Small beats perfect.</strong> A five-minute habit you
                repeat matters more than an ideal routine you abandon.
              </li>
              <li>
                <strong>Evidence over hype.</strong> We favour approaches with
                real research behind them, and say so when evidence is thin.
              </li>
              <li>
                <strong>No judgement.</strong> Struggling is human. Our writing
                is calm, kind, and free of shame.
              </li>
              <li>
                <strong>Accessible always.</strong> Every guide is free to read,
                with no paywalls.
              </li>
            </ul>

            <h2>What we write about</h2>
            <p>
              Stress and anxiety, sleep, mindfulness and breathing techniques,
              emotional regulation, focus and motivation, healthy routines, and
              building resilience over time.
            </p>

            <h2>An important note</h2>
            <p>
              LifeSecret Plus shares general educational content. It is not
              medical advice and is not a substitute for professional care. If
              you are struggling with your mental health, please speak with a
              qualified professional or your local crisis service.
            </p>

            <p style={{ marginTop: "2rem" }}>
              <Link className="btn" href="/contact">
                Contact the team
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
