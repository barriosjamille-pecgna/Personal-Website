import "./profileBadge.css";

const LEAVES = [
  { top: "2%", left: "48%", delay: "0s", duration: "4.5s", rotate: "-10deg" },
  { top: "18%", left: "84%", delay: "1.1s", duration: "5.2s", rotate: "35deg" },
  { top: "62%", left: "92%", delay: "2.3s", duration: "4.8s", rotate: "70deg" },
  { top: "88%", left: "58%", delay: "0.6s", duration: "5.6s", rotate: "150deg" },
  { top: "80%", left: "10%", delay: "1.8s", duration: "4.9s", rotate: "-150deg" },
  { top: "40%", left: "0%", delay: "3s", duration: "5.1s", rotate: "-70deg" },
  { top: "10%", left: "14%", delay: "2.6s", duration: "4.6s", rotate: "-35deg" },
];

export default function ProfileBadge() {
  return (
    <div className="profile-badge" aria-hidden="true">
      <span className="profile-badge__leaves">
        {LEAVES.map((leaf, i) => (
          <span
            key={i}
            className="profile-badge__leaf"
            style={{
              top: leaf.top,
              left: leaf.left,
              animationDelay: leaf.delay,
              animationDuration: leaf.duration,
              "--leaf-rotate": leaf.rotate,
            }}
          />
        ))}
      </span>
      <img src="/assets/profile/profile.gif" alt="" className="profile-badge__img" />
    </div>
  );
}
