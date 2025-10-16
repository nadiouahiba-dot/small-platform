// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { styled, keyframes } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CompanyHero from "../assets/marabes-2.png";

/* ========== ANIMATIONS ========== */
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const float = keyframes`
  0%   { transform: translate(0, 0) scale(1); opacity: 0.9; }
  50%  { transform: translate(30px, -25px) scale(1.05); opacity: 1; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.9; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ========== BACKGROUND ========== */
const Page = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "64px 16px",
  position: "relative",
  overflow: "hidden",
});

const AnimatedBg = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 0,
  background:
    "linear-gradient(120deg, #b4f4d1ff, #c7f9e0ff, #ebfdf3, #bff3ddff, #e8f6ee)",
  backgroundSize: "400% 400%",
  animation: `${gradientShift} 20s ease-in-out infinite`,
});

const BgBlob = styled("div")({
  position: "absolute",
  width: 450,
  height: 450,
  borderRadius: "50%",
  filter: "blur(60px)",
  opacity: 0.3,
  pointerEvents: "none",
  animation: `${float} 18s ease-in-out infinite`,
  zIndex: 0,
});

/* ========== CARD ========== */
const CardRoot = styled(Paper)(({ theme }) => ({
  borderRadius: 28,
  overflow: "hidden",
  background: "transparent",
  display: "grid",
  gridTemplateColumns: "1fr",
  maxWidth: 960,
  minHeight: 640, // ⬅️ Taller card
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  boxShadow:
    "0 30px 80px rgba(16,24,40,0.15), 0 12px 30px rgba(45,159,71,0.08)",
  animation: `${fadeIn} 1.2s ease forwards`,
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "0.65fr 0.65fr",
  },
}));

/* LEFT PANEL */
const LeftPanel = styled(Box)(({ theme }) => ({
  color: "#fff",
  background:
    "linear-gradient(150deg, #138f45 0%, #0d7037 50%, #085b2d 100%)",
  padding: theme.spacing(2, 3), // more vertical padding
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: theme.spacing(3),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 70%)",
  },
}));

const CompanyImage = styled("img")({
  width: "100%",
  maxWidth: 410,
  height: "auto",
  objectFit: "contain",
  marginBottom: 20,
});

/* RIGHT PANEL (GLASS) */
const RightPanel = styled(Box)(({ theme }) => ({
  position: "relative",
  // softer, greener glass
  background:
    "linear-gradient(to bottom right, rgba(255,255,255,0.42), rgba(226, 247, 237, 0.34))",
  backdropFilter: "blur(18px) saturate(170%)",
  WebkitBackdropFilter: "blur(18px) saturate(170%)",
  borderLeft: "1px solid rgba(42,171,94,0.18)",
  boxShadow: "inset 0 0 0 1px rgba(42,171,94,0.05)",
  padding: theme.spacing(6, 6),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  // subtle corner glow so it doesn't look flat
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(600px 300px at 20% 0%, rgba(42,171,94,0.09), transparent 60%)",
    pointerEvents: "none",
  },
}));


/* INPUTS & BUTTON */
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    backgroundColor: "#fff",
    transition: "all .2s ease",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.12)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2d9f47" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2d9f47",
      borderWidth: 2,
    },
  },
  "& .MuiInputBase-input": {
    backgroundColor: "#fff !important",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2d9f47" },
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    WebkitTextFillColor: "#0f172a",
    caretColor: "#0f172a",
    transition: "background-color 9999s ease-in-out 0s",
    boxShadow: "0 0 0px 1000px #ffffff inset",
  },
}));

const PrimaryBtn = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1.1rem",
  background: "linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)",
  color: "#fff",
  boxShadow: "0 12px 26px rgba(45,159,71,0.3)",
  transition: "all .3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)",
    boxShadow: "0 0 18px rgba(45,159,71,0.6), 0 12px 26px rgba(45,159,71,0.4)",
    transform: "translateY(-2px)",
  },
}));

/* ========== COMPONENT ========== */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Page>
      <AnimatedBg />
      <BgBlob
        style={{
          top: -100,
          left: -120,
          background:
            "radial-gradient(circle at 30% 30%, rgba(64,196,120,0.45), rgba(64,196,120,0) 60%)",
        }}
      />
      <BgBlob
        style={{
          bottom: -120,
          right: -100,
          background:
            "radial-gradient(circle at 70% 70%, rgba(31,168,102,0.45), rgba(31,168,102,0) 60%)",
          animationDuration: "22s",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <CardRoot>
          <LeftPanel>
            <CompanyImage src={CompanyHero} alt="MARABES" />
            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.2, mb: 1 }}>
              Your all-in-one outsourcing solution
            </Typography>
            <Typography sx={{ opacity: 0.9, fontSize: "1.05rem" }}>
              We streamline operations so your team can focus on growth.
            </Typography>
            <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap" sx={{ mt: 3 }}>
              <Chip label="24/7 Support" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", fontWeight: 500 }} />
              <Chip label="Secure & Private" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", fontWeight: 500 }} />
              <Chip label="Scalable" variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff", fontWeight: 500 }} />
            </Stack>
          </LeftPanel>

          <RightPanel>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Welcome back
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Log in to your account to continue
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <StyledTextField
                label="Email"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#2d9f47" }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="you@example.com"
              />

              <StyledTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#2d9f47" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        sx={{ color: "#2d9f47" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="••••••••"
              />

              <Link component="button" type="button" underline="hover" sx={{ fontSize: 14, alignSelf: "flex-end", mb: 1 }}>
                Forgot your password?
              </Link>

              <PrimaryBtn type="submit" variant="contained" fullWidth>
                Log in
              </PrimaryBtn>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" align="center" sx={{ color: "text.secondary" }}>
              © 2025 MARABES
            </Typography>
          </RightPanel>
        </CardRoot>
      </Container>
    </Page>
  );
}
