import { useAuth0 } from "@auth0/auth0-react"

function App() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } = useAuth0()

  if (isLoading) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <span style={s.ship}>🚢</span>
          <p style={s.sub}>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h2 style={{ color: "#e53e3e" }}>Error</h2>
          <p style={s.sub}>{error.message}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <span style={s.ship}>🚢</span>
          <h1 style={s.title}>Cruise0</h1>
          <p style={s.tagline}>Book your next adventure at sea</p>
          <button style={s.btn} onClick={() => loginWithRedirect()}>
            Log In / Sign Up
          </button>
        </div>
      </div>
    )
  }

  if (!user.email_verified) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <span style={s.ship}>📧</span>
          <h2 style={{ color: "#e53e3e", marginTop: 8 }}>Email Not Verified</h2>
          <p style={s.sub}>Please check your inbox and verify your email to continue.</p>
          <button style={s.btnOutline} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <span style={s.ship}>⚓</span>
        <h1 style={s.title}>Welcome Aboard!</h1>
        <img src={user.picture} alt={user.name} style={s.avatar} />
        <p style={s.name}>{user.name}</p>
        <p style={s.email}>{user.email}</p>
        <p style={s.verified}>✓ Email verified</p>
        <div style={s.divider} />
        <p style={s.hint}>You are now ready to book your cruise adventure.</p>
        <button style={s.btnOutline} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log Out
        </button>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2b5b 0%, #1a4a8a 50%, #0e7490 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, system-ui, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 16,
    padding: "48px 40px",
    textAlign: "center",
    width: 360,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  ship: { fontSize: 48 },
  title: { fontSize: 32, fontWeight: 700, color: "#0f2b5b", margin: "8px 0 4px" },
  tagline: { color: "#4a5568", margin: "0 0 28px", fontSize: 15 },
  sub: { color: "#4a5568", margin: "8px 0 24px", fontSize: 15 },
  btn: {
    background: "#0f2b5b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 32px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  },
  btnOutline: {
    background: "transparent",
    color: "#0f2b5b",
    border: "2px solid #0f2b5b",
    borderRadius: 8,
    padding: "10px 32px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 16,
  },
  avatar: { width: 72, height: 72, borderRadius: "50%", marginTop: 16, border: "3px solid #0f2b5b" },
  name: { fontSize: 18, fontWeight: 700, color: "#0f2b5b", margin: "12px 0 4px" },
  email: { color: "#4a5568", fontSize: 14, margin: "0 0 6px" },
  verified: { color: "#38a169", fontSize: 13, fontWeight: 600 },
  divider: { height: 1, background: "#e2e8f0", margin: "20px 0" },
  hint: { color: "#718096", fontSize: 14, marginBottom: 0 },
}

export default App
