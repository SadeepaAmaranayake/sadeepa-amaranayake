import { useState } from "react";
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
  process.env.REACT_APP_API_URL || "http://localhost:5050";

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
            borderRadius: 3,
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
              py: 1.5,
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
              sx={{ color: "white" }}
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
                    borderRadius: 2,
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
        variant="contained"
        onClick={() => setOpen((current) => !current)}
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 24 },
          bottom: { xs: 12, sm: 24 },
          zIndex: 1400,
          minWidth: 58,
          height: 58,
          borderRadius: "50%",
          fontWeight: 800,
          boxShadow: "0 12px 35px rgba(22,139,255,0.4)",
        }}
        aria-label="Open portfolio assistant"
      >
        AI
      </Button>
    </>
  );
}

export default PortfolioChat;