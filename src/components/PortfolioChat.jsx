import { useState } from "react";
import { keyframes } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5050");

const sunSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const sunPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 18px rgba(255, 181, 46, 0.55),
      0 0 38px rgba(255, 116, 35, 0.28);
  }
  50% {
    transform: scale(1.07);
    box-shadow: 0 0 26px rgba(255, 210, 72, 0.78),
      0 0 52px rgba(255, 116, 35, 0.4);
  }
`;

function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me about Sadeepa's projects, skills, or certificates.",
    },
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      { role: "user", text: message },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error.message || "The assistant is currently unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <Paper
          elevation={12}
          sx={{
            position: "fixed",
            right: { xs: 12, sm: 24 },
            bottom: { xs: 82, sm: 94 },
            zIndex: 1400,
            width: { xs: "calc(100vw - 24px)", sm: 390 },
            height: { xs: 500, sm: 560 },
            maxHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 1,
            border: "1px solid rgba(22, 139, 255, 0.3)",
            backgroundColor: "#080b12",
            color: "#ffffff",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              pr: 7,
              py: 1.5,
              position: "relative",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Box>
              <Typography fontWeight={700}>
                Portfolio assistant
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Powered by Sadeepa's portfolio knowledge
              </Typography>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
              }}
            >
              ×
            </IconButton>
          </Stack>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            <Stack spacing={1.5}>
              {messages.map((message, index) => (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    alignSelf:
                      message.role === "user"
                        ? "flex-end"
                        : "flex-start",
                    maxWidth: "88%",
                    px: 1.5,
                    py: 1.2,
                    borderRadius: 1,
                    backgroundColor:
                      message.role === "user"
                        ? "#168bff"
                        : "rgba(255,255,255,0.09)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {message.text}
                  </Typography>

                  {message.sources?.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 1,
                        opacity: 0.7,
                      }}
                    >
                      Sources: {message.sources.join(", ")}
                    </Typography>
                  )}
                </Box>
              ))}

              {loading && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <CircularProgress size={16} />
                  <Typography variant="caption">
                    Searching portfolio…
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Box
            component="form"
            onSubmit={sendMessage}
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about projects or skills"
              value={input}
              disabled={loading}
              inputProps={{ maxLength: 1000 }}
              onChange={(event) => setInput(event.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading || !input.trim()}
            >
              Send
            </Button>
          </Box>
        </Paper>
      )}

      <Button
        onClick={() => setOpen((current) => !current)}
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 24 },
          bottom: { xs: 12, sm: 24 },
          zIndex: 1400,
          minWidth: 68,
          width: 68,
          height: 68,
          p: 0,
          borderRadius: "50%",
          overflow: "visible",
          fontWeight: 800,
          color: "#13100a",
          background: "transparent",
          transition: "transform 180ms ease",
          "&:hover": {
            background: "transparent",
            transform: "scale(1.06)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -5,
            borderRadius: "50%",
            background:
              "repeating-conic-gradient(from 0deg, #ffd45c 0deg 6deg, transparent 6deg 30deg)",
            WebkitMask:
              "radial-gradient(circle, transparent 0 31px, #000 32px 36px, transparent 37px)",
            mask:
              "radial-gradient(circle, transparent 0 31px, #000 32px 36px, transparent 37px)",
            animation: `${sunSpin} 12s linear infinite`,
          },
        }}
        aria-label="Open portfolio assistant"
        aria-expanded={open}
      >
        <Box
          component="span"
          sx={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            placeItems: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #fff5a8 0%, #ffd447 35%, #ff9418 72%, #f45b16 100%)",
            border: "1px solid rgba(255, 242, 157, 0.9)",
            animation: `${sunPulse} 2.6s ease-in-out infinite`,
            fontSize: 17,
            letterSpacing: "0.08em",
          }}
        >
          {open ? "×" : "AI"}
        </Box>
      </Button>
    </>
  );
}

export default PortfolioChat;
