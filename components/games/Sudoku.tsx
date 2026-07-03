"use client";

export default function Sudoku() {
  return (
    <>
      <div id="sudoku_embed" style={{ width: "100%" }}>
        <style>
          {`
            @media (max-width: 800px) {
              #sudoku_embed > div {
                padding-bottom: 90% !important; /* Change aspect ratio on mobile */
              }
            }
            @media (max-width: 568px) {
              #sudoku_embed > div {
                padding-bottom: 100% !important; /* Change aspect ratio on mobile */
              }
            }
            @media (max-width: 414px) {
              #sudoku_embed > div {
                padding-bottom: 120% !important; /* Change aspect ratio on mobile */
              }
            }
          `}
        </style>
        <div
          style={{
            position: "relative",
            paddingBottom: "75%",
            borderRadius: "var(--radius-md, 6px)",
            overflow: "hidden",
          }}
        >
          <iframe
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              border: 0,
            }}
            frameBorder="0"
            width="100%"
            height="100%"
            allowFullScreen
            src="https://cdn.htmlgames.com/DailyMiniSudoku/"
            title="Play Klondike (Turn 3) and many more Solitaire games at online-solitaire.com"
          />
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              pointerEvents: "none",
              boxShadow: "inset 0px 0px 0px 1px rgba(0,0,0,0.25)",
              borderRadius: "var(--radius-md, 6px)",
            }}
          />
        </div>
        <p
          style={{
            fontSize: 16,
            lineHeight: "40px",
            width: "100%",
            textAlign: "center",
            margin: 0,
          }}
        ></p>
      </div>
    </>
  );
}
