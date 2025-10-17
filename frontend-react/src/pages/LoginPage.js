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
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import MarabesLogo from "../assets/marabes-logo.png";

/* ========== ANIMATIONS ========== */
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const float = keyframes`
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(28px, -22px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ========== PAGE BACKGROUND ========== */
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
    "linear-gradient(120deg, #b4f4d1, #c7f9e0, #ebfdf3, #bff3dd, #e8f6ee)",
  backgroundSize: "400% 400%",
  animation: `${gradientShift} 20s ease-in-out infinite`,
});

const BgBlob = styled("div")({
  position: "absolute",
  width: 450,
  height: 450,
  borderRadius: "50%",
  filter: "blur(60px)",
  opacity: 0.28,
  pointerEvents: "none",
  animation: `${float} 18s ease-in-out infinite`,
  zIndex: 0,
});

/* ========== CARD LAYOUT ========== */
const CardRoot = styled(Paper)(({ theme }) => ({
  borderRadius: 32,
  overflow: "hidden",
  background: "#ffffff",
  display: "grid",
  gridTemplateColumns: "1fr",
  maxWidth: 980,
  minHeight: 560,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  boxShadow:
    "0 24px 70px rgba(16,24,40,0.14), 0 10px 26px rgba(45,159,71,0.10)",
  animation: `${fadeIn} 1.0s ease forwards`,
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "0.85fr 1.15fr",
  },
}));

/* ========== LEFT PANEL ========== */
const LeftPanel = styled(Box)(({ theme }) => ({
  color: "#fff",
  background:
    "linear-gradient(155deg, #25b864 0%, #1ea75a 48%, #1a8f4c 100%)",
  padding: theme.spacing(6, 4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "10%",
    left: "-5%",
    width: 260,
    height: 260,
    background: "rgba(255,255,255,0.14)",
    borderRadius: "50%",
    filter: "blur(44px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "6%",
    right: "-12%",
    width: 220,
    height: 220,
    background: "rgba(255,255,255,0.10)",
    borderRadius: "50%",
    filter: "blur(40px)",
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(5, 3.5),
  },
}));

/* ⬇️ Badge + image updated so the logo fills the box */
const LogoBadge = styled(Box)({
  width: 148,
  height: 148,
  borderRadius: 30,
  overflow: "hidden",               // clip the image corners
  background: "#ffffff",            // clean backdrop
  marginBottom: 18,
  boxShadow: "0 16px 34px rgba(0,0,0,0.18)",
  border: "1px solid rgba(255,255,255,0.28)",
  display: "block",
});

const LogoImg = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",               // fill the whole box (may crop slightly)
  display: "block",
});

/* ========== RIGHT PANEL (mint) ========== */
const RightPanel = styled(Box)(({ theme }) => ({
  position: "relative",
  background:
    "linear-gradient(135deg, #f7fffb 0%, #effbf4 40%, #e8f7f0 100%)",
  padding: theme.spacing(6, 5),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(5, 4),
  },
}));

/* ========== GLASS FORM CARD ========== */
const FormCard = styled(Paper)(({ theme }) => ({
  borderRadius: 22,
  padding: theme.spacing(4),
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.55), rgba(255,255,255,0.28))",
  backdropFilter: "blur(16px) saturate(160%)",
  WebkitBackdropFilter: "blur(16px) saturate(160%)",
  border: "1px solid rgba(42,171,94,0.18)",
  boxShadow:
    "0 22px 50px rgba(28,137,86,0.12), 0 2px 8px rgba(16, 24, 40, 0.06)",
}));

/* ========== INPUTS & BUTTONS (no blue) ========== */
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    background: "#ffffff !important",
    transition: "all .25s ease",
    "& fieldset": { borderColor: "rgba(0,0,0,0.10)" },
    "&:hover fieldset": { borderColor: "#2d9f47" },
    "&.Mui-focused fieldset": { borderColor: "#2d9f47", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "0 0 0 0 transparent", outline: "none" },
  },
  "& .MuiInputBase-input": {
    padding: "14px 16px",
    fontSize: "0.96rem",
    caretColor: "#2d9f47",
  },
  "& label": { color: "#678a79" },
  "& label.Mui-focused": { color: "#2d9f47" },
  "& input:-webkit-autofill": {
    WebkitTextFillColor: "#0f172a",
    transition: "background-color 9999s ease-in-out 0s",
    boxShadow: "0 0 0px 1000px #ffffff inset",
  },
});

const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.4, 2.6),
  textTransform: "none",
  fontWeight: 700,
  fontSize: "1rem",
  background: "linear-gradient(135deg, #2d9f47 0%, #1a7a35 100%)",
  color: "#fff",
  boxShadow: "0 8px 20px rgba(45,159,71,0.30)",
  transition: "all .25s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #1a7a35 0%, #2d9f47 100%)",
    boxShadow:
      "0 0 16px rgba(45,159,71,0.45), 0 8px 20px rgba(45,159,71,0.35)",
    transform: "translateY(-1px)",
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
      setErrorMsg(
        err.response?.data?.message || "Login failed. Please try again."
      );
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
            "radial-gradient(circle at 30% 30%, rgba(64,196,120,0.42), rgba(64,196,120,0) 60%)",
        }}
      />
      <BgBlob
        style={{
          bottom: -120,
          right: -100,
          background:
            "radial-gradient(circle at 70% 70%, rgba(31,168,102,0.42), rgba(31,168,102,0) 60%)",
          animationDuration: "22s",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <CardRoot elevation={0}>
          {/* LEFT – Brand side */}
          <LeftPanel>
            <LogoBadge>
              <LogoImg src={MarabesLogo} alt="MARABES logo" />
            </LogoBadge>

            <Typography
              sx={{
                fontWeight: 900,
                letterSpacing: 1.2,
                fontSize: 30,
                opacity: 0.98,
              }}
            >
              MARABES
            </Typography>

            <Typography
              sx={{
                fontWeight: 900,
                lineHeight: 1.15,
                fontSize: 26,
                maxWidth: 480,
              }}
            >
              All-in-one outsourcing
            </Typography>

            <Typography sx={{ opacity: 0.95, fontSize: 14, mt: -0.5 }}>
              Streamline ops. Focus on growth.
            </Typography>

            <Typography variant="caption" sx={{ mt: 1.5, opacity: 0.85 }}>
              outsourcing made simple.
            </Typography>
          </LeftPanel>

          {/* RIGHT – Mint surface */}
          <RightPanel>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  mb: 0.4,
                  lineHeight: 1.1,
                  fontSize: { xs: 28, sm: 34, md: 38 },
                  letterSpacing: 0.2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                Welcome back <span role="img" aria-label="waving hand">👋</span>
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                Log in to your account to continue
              </Typography>
            </Box>

            <FormCard variant="outlined">
              {errorMsg && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 80, 80, 0.08)",
                    border: "1px solid rgba(255,80,80,0.25)",
                  }}
                >
                  {errorMsg}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
              >
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
                        <EmailIcon sx={{ color: "#2d9f47", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
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
                        <LockIcon sx={{ color: "#2d9f47", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                          size="small"
                          sx={{ color: "#2d9f47" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <LoginButton type="submit" variant="contained" fullWidth>
                  Log in
                </LoginButton>
              </Box>

              <Divider sx={{ my: 2.5 }} />
              <Typography
                variant="caption"
                align="center"
                sx={{ color: "text.secondary", display: "block" }}
              >
                © 2025 MARABES
              </Typography>
            </FormCard>
          </RightPanel>
        </CardRoot>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#6b7280", fontSize: 13 }}>
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Page>
  );
}
