/* =========================================================
   AbsoluteScore V15
   Tournament UI
   ========================================================= */

(function () {
    "use strict";

    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getTournament() {
        return window.AbsoluteScoreV13?.tournament?.() || null;
    }

    function getLeaderboard() {
        return window.AbsoluteScoreV13?.leaderboard?.() || [];
    }

    function render() {
        const root = document.getElementById(
            "absoluteScoreTournament"
        );

        if (!root) return;

        const tournament = getTournament();

        if (!tournament) {
            root.innerHTML = `
                <div class="as-v15-empty">
                    Tournament system unavailable.
                </div>
            `;
            return;
        }

        const leaderboard = getLeaderboard();

        root.innerHTML = `
            <section class="as-v15-dashboard">

                <header class="as-v15-header">

                    <div>
                        <div class="as-v15-label">
                            ABSOLUTESCORE
                        </div>

                        <h1>
                            ${esc(tournament.name)}
                        </h1>

                        <p>
                            ${esc(tournament.date)}
                        </p>
                    </div>

                    <button
                        class="as-v15-refresh"
                        id="asV15Refresh">
                        ↻ Refresh
                    </button>

                </header>


                <div class="as-v15-stats">

                    <div class="as-v15-stat">
                        <span>TEAMS</span>
                        <strong>
                            ${tournament.teams.length}
                        </strong>
                    </div>

                    <div class="as-v15-stat">
                        <span>MATCHES</span>
                        <strong>
                            ${tournament.matches.length}
                        </strong>
                    </div>

                    <div class="as-v15-stat">
                        <span>RESULTS</span>
                        <strong>
                            ${tournament.matches.reduce(
                                (n, m) =>
                                    n +
                                    (m.results?.length || 0),
                                0
                            )}
                        </strong>
                    </div>

                    <div class="as-v15-stat">
                        <span>POINTS</span>
                        <strong>
                            ${leaderboard.reduce(
                                (n, t) =>
                                    n +
                                    Number(t.points || 0),
                                0
                            )}
                        </strong>
                    </div>

                </div>


                <div class="as-v15-section">

                    <div class="as-v15-section-title">
                        🏆 OVERALL LEADERBOARD
                    </div>

                    <div class="as-v15-table">

                        <div class="as-v15-table-head">
                            <span>#</span>
                            <span>TEAM</span>
                            <span>MATCHES</span>
                            <span>KILLS</span>
                            <span>POINTS</span>
                        </div>

                        ${
                            leaderboard.length
                                ? leaderboard
                                    .map(
                                        (team) => `
                                <div
                                    class="
                                    as-v15-row
                                    ${
                                        team.rank <= 3
                                            ? "top-team"
                                            : ""
                                    }
                                    "
                                >

                                    <span class="rank">
                                        ${team.rank}
                                    </span>

                                    <span class="team">
                                        ${esc(team.team)}
                                    </span>

                                    <span>
                                        ${team.matches}
                                    </span>

                                    <span>
                                        ${team.kills}
                                    </span>

                                    <strong>
                                        ${team.points}
                                    </strong>

                                </div>
                            `
                                    )
                                    .join("")
                                : `
                                    <div class="as-v15-no-results">
                                        No results yet.
                                    </div>
                                `
                        }

                    </div>

                </div>


                <div class="as-v15-section">

                    <div class="as-v15-section-title">
                        🎮 MATCH HISTORY
                    </div>

                    <div class="as-v15-matches">

                        ${
                            tournament.matches.length
                                ? tournament.matches
                                    .map(
                                        (match) => `
                                <div
                                    class="as-v15-match"
                                >
                                    <div>
                                        <strong>
                                            ${esc(match.name)}
                                        </strong>

                                        <small>
                                            ${
                                                match.results
                                                    ?.length || 0
                                            }
                                            results
                                        </small>
                                    </div>

                                    <span>
                                        ${
                                            match.results
                                                ?.reduce(
                                                    (n, r) =>
                                                        n +
                                                        Number(
                                                            r.total ||
                                                                0
                                                        ),
                                                    0
                                                ) || 0
                                        }
                                        pts
                                    </span>
                                </div>
                            `
                                    )
                                    .join("")
                                : `
                                    <div class="as-v15-no-results">
                                        No matches created.
                                    </div>
                                `
                        }

                    </div>

                </div>

            </section>
        `;

        document
            .getElementById("asV15Refresh")
            ?.addEventListener(
                "click",
                render
            );
    }

    function injectStyles() {
        if (
            document.getElementById(
                "absoluteScoreV15Styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "absoluteScoreV15Styles";

        style.textContent = `
            #absoluteScoreTournament {
                width: 100%;
                margin: 20px auto;
                max-width: 1100px;
                font-family: Arial, sans-serif;
            }

            .as-v15-dashboard {
                background: #0b0b10;
                color: #fff;
                border-radius: 18px;
                padding: 20px;
                border: 1px solid #272733;
                box-shadow:
                    0 15px 45px rgba(0,0,0,.35);
            }

            .as-v15-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }

            .as-v15-label {
                font-size: 11px;
                letter-spacing: 3px;
                opacity: .55;
                font-weight: 700;
            }

            .as-v15-header h1 {
                margin: 4px 0;
                font-size: 28px;
            }

            .as-v15-header p {
                margin: 0;
                opacity: .55;
            }

            .as-v15-refresh {
                border: 0;
                border-radius: 10px;
                padding: 10px 15px;
                cursor: pointer;
                font-weight: 700;
            }

            .as-v15-stats {
                display: grid;
                grid-template-columns:
                    repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }

            .as-v15-stat {
                background: #15151d;
                border: 1px solid #282832;
                border-radius: 12px;
                padding: 15px;
            }

            .as-v15-stat span {
                display: block;
                font-size: 10px;
                opacity: .55;
                letter-spacing: 1px;
            }

            .as-v15-stat strong {
                display: block;
                margin-top: 5px;
                font-size: 25px;
            }

            .as-v15-section {
                margin-top: 20px;
                background: #101017;
                border: 1px solid #252530;
                border-radius: 14px;
                overflow: hidden;
            }

            .as-v15-section-title {
                padding: 15px;
                font-weight: 800;
                border-bottom: 1px solid #252530;
            }

            .as-v15-table-head,
            .as-v15-row {
                display: grid;
                grid-template-columns:
                    50px minmax(120px, 1fr)
                    100px 80px 100px;
                gap: 10px;
                align-items: center;
                padding: 13px 15px;
            }

            .as-v15-table-head {
                font-size: 10px;
                opacity: .5;
                text-transform: uppercase;
            }

            .as-v15-row {
                border-top: 1px solid #20202a;
            }

            .as-v15-row .rank {
                font-weight: 900;
                font-size: 18px;
            }

            .as-v15-row .team {
                font-weight: 700;
            }

            .as-v15-row strong {
                font-size: 18px;
            }

            .as-v15-row.top-team {
                background: #15151d;
            }

            .as-v15-no-results {
                padding: 30px;
                text-align: center;
                opacity: .45;
            }

            .as-v15-matches {
                display: grid;
                gap: 1px;
            }

            .as-v15-match {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #12121a;
            }

            .as-v15-match strong {
                display: block;
            }

            .as-v15-match small {
                display: block;
                margin-top: 3px;
                opacity: .5;
            }

            .as-v15-match span {
                font-weight: 800;
            }

            @media (max-width: 650px) {

                .as-v15-dashboard {
                    padding: 12px;
                    border-radius: 12px;
                }

                .as-v15-header {
                    align-items: flex-start;
                }

                .as-v15-header h1 {
                    font-size: 21px;
                }

                .as-v15-stats {
                    grid-template-columns:
                        repeat(2, 1fr);
                }

                .as-v15-table-head,
                .as-v15-row {
                    grid-template-columns:
                        35px minmax(100px, 1fr)
                        65px 55px 70px;
                    font-size: 12px;
                    padding: 11px 8px;
                }

                .as-v15-table {
                    overflow-x: auto;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function init() {
        injectStyles();
        render();
    }

    window.AbsoluteScoreV15 = {
        render,
        init
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }
})();
