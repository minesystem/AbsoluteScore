/* =========================================================
   AbsoluteScore V13
   Dashboard + Tournament Data Foundation
   ========================================================= */

const AS_V13_KEY = "AbsoluteScore_V13_Tournament";

const defaultTournament = {
    id: crypto.randomUUID(),
    name: "New Tournament",
    date: new Date().toISOString().slice(0, 10),
    teams: [],
    matches: [],
    settings: {
        killPoints: 5,
        top1: 20,
        top2: 15,
        top3: 5
    }
};

let tournamentV13 = loadTournamentV13();

/* -----------------------------
   STORAGE
----------------------------- */

function loadTournamentV13() {
    try {
        const saved = localStorage.getItem(AS_V13_KEY);

        if (!saved) {
            return structuredClone(defaultTournament);
        }

        const data = JSON.parse(saved);

        return {
            ...structuredClone(defaultTournament),
            ...data,
            settings: {
                ...defaultTournament.settings,
                ...(data.settings || {})
            },
            teams: Array.isArray(data.teams) ? data.teams : [],
            matches: Array.isArray(data.matches) ? data.matches : []
        };
    } catch (error) {
        console.error("Failed to load tournament:", error);
        return structuredClone(defaultTournament);
    }
}

function saveTournamentV13() {
    localStorage.setItem(
        AS_V13_KEY,
        JSON.stringify(tournamentV13)
    );

    renderDashboardV13();
}

/* -----------------------------
   TOURNAMENT
----------------------------- */

function createTournamentV13(name, date = "") {
    tournamentV13 = {
        id: crypto.randomUUID(),
        name: String(name || "New Tournament").trim(),
        date: date || new Date().toISOString().slice(0, 10),
        teams: [],
        matches: [],
        settings: {
            killPoints: 5,
            top1: 20,
            top2: 15,
            top3: 5
        }
    };

    saveTournamentV13();
}

function updateTournamentNameV13(name) {
    tournamentV13.name =
        String(name || "New Tournament").trim();

    saveTournamentV13();
}

function updateTournamentDateV13(date) {
    tournamentV13.date = date;

    saveTournamentV13();
}

/* -----------------------------
   TEAMS
----------------------------- */

function addTeamV13(name) {
    const cleanName = String(name || "").trim();

    if (!cleanName) {
        return false;
    }

    const exists = tournamentV13.teams.some(
        team =>
            normalizeTeamV13(team.name) ===
            normalizeTeamV13(cleanName)
    );

    if (exists) {
        return false;
    }

    tournamentV13.teams.push({
        id: crypto.randomUUID(),
        name: cleanName,
        logo: "",
        createdAt: Date.now()
    });

    saveTournamentV13();

    return true;
}

function removeTeamV13(teamId) {
    tournamentV13.teams =
        tournamentV13.teams.filter(
            team => team.id !== teamId
        );

    saveTournamentV13();
}

function renameTeamV13(teamId, newName) {
    const team = tournamentV13.teams.find(
        item => item.id === teamId
    );

    if (!team) return false;

    const cleanName = String(newName || "").trim();

    if (!cleanName) return false;

    team.name = cleanName;

    saveTournamentV13();

    return true;
}

/* -----------------------------
   MATCHES
----------------------------- */

function createMatchV13(matchNumber = null) {
    const nextNumber =
        matchNumber ||
        tournamentV13.matches.length + 1;

    const match = {
        id: crypto.randomUUID(),
        number: nextNumber,
        name: `Match ${nextNumber}`,
        date: new Date().toISOString(),
        results: []
    };

    tournamentV13.matches.push(match);

    saveTournamentV13();

    return match.id;
}

function addMatchResultV13(
    matchId,
    teamName,
    placement = 0,
    kills = 0,
    bonus = 0
) {
    const match = tournamentV13.matches.find(
        item => item.id === matchId
    );

    if (!match) return false;

    const cleanName = String(teamName || "").trim();

    if (!cleanName) return false;

    const placementNumber =
        Number(placement) || 0;

    const killNumber =
        Number(kills) || 0;

    const bonusNumber =
        Number(bonus) || 0;

    const placementPoints =
        placementNumber === 1
            ? tournamentV13.settings.top1
            : placementNumber === 2
                ? tournamentV13.settings.top2
                : placementNumber === 3
                    ? tournamentV13.settings.top3
                    : 0;

    const killPoints =
        killNumber *
        tournamentV13.settings.killPoints;

    const total =
        placementPoints +
        killPoints +
        bonusNumber;

    match.results.push({
        id: crypto.randomUUID(),
        teamName: cleanName,
        placement: placementNumber,
        kills: killNumber,
        bonus: bonusNumber,
        placementPoints,
        killPoints,
        total
    });

    saveTournamentV13();

    return true;
}

function removeMatchV13(matchId) {
    tournamentV13.matches =
        tournamentV13.matches.filter(
            match => match.id !== matchId
        );

    saveTournamentV13();
}

/* -----------------------------
   LEADERBOARD
----------------------------- */

function getLeaderboardV13() {
    const totals = new Map();

    for (const match of tournamentV13.matches) {
        for (const result of match.results || []) {
            const key = normalizeTeamV13(result.teamName);

            if (!totals.has(key)) {
                totals.set(key, {
                    team: result.teamName,
                    matches: 0,
                    kills: 0,
                    points: 0
                });
            }

            const entry = totals.get(key);

            entry.matches += 1;
            entry.kills += Number(result.kills) || 0;
            entry.points += Number(result.total) || 0;
        }
    }

    return [...totals.values()]
        .sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            return b.kills - a.kills;
        })
        .map((entry, index) => ({
            rank: index + 1,
            ...entry
        }));
}

/* -----------------------------
   NORMALIZATION
----------------------------- */

function normalizeTeamV13(name) {
    return String(name || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
}

/* -----------------------------
   DASHBOARD DATA
----------------------------- */

function getDashboardStatsV13() {
    const leaderboard = getLeaderboardV13();

    return {
        teams: tournamentV13.teams.length,
        matches: tournamentV13.matches.length,
        results: tournamentV13.matches.reduce(
            (total, match) =>
                total + (match.results?.length || 0),
            0
        ),
        points: leaderboard.reduce(
            (total, team) => total + team.points,
            0
        )
    };
}

/* -----------------------------
   EXPORT
----------------------------- */

function exportTournamentV13() {
    const data = JSON.stringify(
        tournamentV13,
        null,
        2
    );

    const blob = new Blob(
        [data],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        `${tournamentV13.name || "tournament"}-backup.json`;

    link.click();

    URL.revokeObjectURL(url);
}

/* -----------------------------
   IMPORT
----------------------------- */

function importTournamentV13(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            try {
                const imported =
                    JSON.parse(event.target.result);

                if (
                    !imported ||
                    !Array.isArray(imported.matches) ||
                    !Array.isArray(imported.teams)
                ) {
                    throw new Error(
                        "Invalid AbsoluteScore tournament file."
                    );
                }

                tournamentV13 = {
                    ...structuredClone(defaultTournament),
                    ...imported
                };

                saveTournamentV13();

                resolve(true);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        };

        reader.onerror = reject;

        reader.readAsText(file);
    });
}

/* -----------------------------
   DASHBOARD RENDER
----------------------------- */

function renderDashboardV13() {
    const stats = getDashboardStatsV13();

    const elements = {
        name: document.getElementById(
            "as-v13-tournament-name"
        ),

        date: document.getElementById(
            "as-v13-tournament-date"
        ),

        teams: document.getElementById(
            "as-v13-teams"
        ),

        matches: document.getElementById(
            "as-v13-matches"
        ),

        results: document.getElementById(
            "as-v13-results"
        ),

        points: document.getElementById(
            "as-v13-points"
        )
    };

    if (elements.name) {
        elements.name.textContent =
            tournamentV13.name;
    }

    if (elements.date) {
        elements.date.textContent =
            tournamentV13.date;
    }

    if (elements.teams) {
        elements.teams.textContent =
            stats.teams;
    }

    if (elements.matches) {
        elements.matches.textContent =
            stats.matches;
    }

    if (elements.results) {
        elements.results.textContent =
            stats.results;
    }

    if (elements.points) {
        elements.points.textContent =
            stats.points;
    }
}

/* -----------------------------
   START
----------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    renderDashboardV13
);

window.AbsoluteScoreV13 = {
    tournament: () => tournamentV13,

    createTournament: createTournamentV13,

    updateName: updateTournamentNameV13,

    updateDate: updateTournamentDateV13,

    addTeam: addTeamV13,

    removeTeam: removeTeamV13,

    renameTeam: renameTeamV13,

    createMatch: createMatchV13,

    addMatchResult: addMatchResultV13,

    removeMatch: removeMatchV13,

    leaderboard: getLeaderboardV13,

    stats: getDashboardStatsV13,

    save: saveTournamentV13,

    export: exportTournamentV13,

    import: importTournamentV13
};

console.log(
    "AbsoluteScore V13 Dashboard Foundation loaded."
);
