// src/components/ChartPro.jsx (or .js)
import React, { forwardRef } from "react";
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Divider, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


const ChartPro = forwardRef(function ChartPro(
  {
    data = [],
    onToggleShow = () => {},
    selectedIndex = null,
    onBarClick = () => {},
    title = "Chart",
    subtitle = "",
  },
  ref
) {
  const maxVal = Math.max(1, ...data.map((d) => Number(d.logins) || 0));

  return (
    <Card ref={ref} sx={{ borderRadius: 3, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
        }
        subheader={
          subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null
        }
        action={
          <Tooltip title="Hide">
            <IconButton onClick={() => onToggleShow(false)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        }
        sx={{ pb: 0, "& .MuiCardHeader-action": { alignSelf: "center" } }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(1, data.length)}, 1fr)`,
            alignItems: "end",
            gap: 2,
            height: 260,
            px: 1,
          }}
        >
          {data.map((d, i) => {
            const value = Number(d.logins) || 0;
            const h = (value / maxVal) * 200 + 8; // min height
            const isSelected = selectedIndex === i;

            return (
              <Box key={`${d.day}-${i}`} sx={{ textAlign: "center" }}>
                <Tooltip
                  title={
                    <Box sx={{ px: 0.5, py: 0.3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {d.day}: {value}
                      </Typography>
                      {Array.isArray(d.names) && d.names.length > 0 && (
                        <Typography variant="caption" display="block">
                          {d.names.join(", ")}
                        </Typography>
                      )}
                    </Box>
                  }
                  arrow
                >
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => onBarClick(i)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onBarClick(i)}
                    sx={{
                      mx: "auto",
                      width: 26,
                      height: h,
                      borderRadius: 1.2,
                      transition: "transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease",
                      cursor: "pointer",
                      outline: "none",
                      background: isSelected
                        ? "linear-gradient(135deg, #2d9f47, #1a7a35)"
                        : "rgba(45,159,71,0.35)",
                      boxShadow: isSelected ? "0 8px 18px rgba(45,159,71,0.35)" : "none",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        background: "linear-gradient(135deg, #2d9f47, #1a7a35)",
                        boxShadow: "0 8px 18px rgba(45,159,71,0.35)",
                      },
                    }}
                  />
                </Tooltip>
                <Typography variant="caption" sx={{ mt: 1, display: "block", fontWeight: 700 }}>
                  {d.day}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <LegendSwatch label="Logins" />
          {selectedIndex !== null && data[selectedIndex] && (
            <Typography variant="caption" color="text.secondary">
              Selected: <b>{data[selectedIndex].day}</b> ({data[selectedIndex].logins})
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

export default ChartPro;

function LegendSwatch({ label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: 0.8, background: "linear-gradient(135deg, #2d9f47, #1a7a35)" }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
