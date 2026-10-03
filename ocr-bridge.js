/* =========================================================
   AbsoluteScore V14
   OCR → Tournament Bridge
   ========================================================= */

function ASV14_cleanOCRTeam(name) {
    return String(name || "")
        .replace(/\s+/g, " ")
        .trim();
}

function ASV14_number(value) {
    const n = parseInt(
        String(value || "").replace(/[^\d]/g, ""),
        10
    );

    return Number.isFinite(n) ? n : 0;
}

/*
    Convert existing AbsoluteScore OCR results
    into tournament results.

    Expected OCR format:

    [
        {
            team: "TEAM NAME",
            score: 120
        }
    ]
*/

function ASV14_importOCRResults(
    ocrResults,
    matchId
) {
    if (!Array.isArray(ocrResults)) {
        console.error(
            "OCR results must be an array."
        );
        return false;
    }

    if (!matchId) {
        console.error(
            "A match ID is required."
        );
        return false;
    }

    const match =
        tournamentV13.matches.find(
            m => m.id === matchId
        );

    if (!match) {
        console.error(
            "Match not found:",
            matchId
        );
        return false;
    }

    let imported = 0;

    for (const row of ocrResults) {
        const team = ASV14_cleanOCRTeam(
            row.team ||
            row.name ||
            row.teamName
        );

        const score = ASV14_number(
            row.score ||
            row.points ||
            row.total
        );

        if (!team || score < 0) {
            continue;
        }

        /*
            OCR score is treated as the
            already-calculated match score.

            This prevents the OCR system from
            accidentally applying kill points
            twice.
        */

        match.results.push({
            id: crypto.randomUUID(),

            teamName: team,

            placement: 0,

            kills: 0,

            bonus: 0,

            placementPoints: 0,

            killPoints: 0,

            total: score,

            source: "OCR",

            importedAt: Date.now()
        });

        imported++;
    }

    saveTournamentV13();

    console.log(
        `AbsoluteScore: imported ${imported} OCR results.`
    );

    return imported;
}


/* ---------------------------------------------------------
   IMPORT FROM THE EXISTING GLOBAL OCR ARRAY
--------------------------------------------------------- */

function ASV14_importExistingOCR(matchId) {

    /*
        V10/V11/V12 versions used "finalResults"
        for the calculated OCR leaderboard.
    */

    if (
        typeof finalResults === "undefined" ||
        !Array.isArray(finalResults)
    ) {
        console.error(
            "No existing OCR finalResults found."
        );

        return false;
    }

    const converted = finalResults.map(row => ({
        team:
            row.team ||
            row.name ||
            row.teamName,

        score:
            row.score ||
            row.points ||
            row.total
    }));

    return ASV14_importOCRResults(
        converted,
        matchId
    );
}


/* ---------------------------------------------------------
   CREATE MATCH THEN IMPORT
--------------------------------------------------------- */

function ASV14_createMatchFromOCR(
    matchName = null
) {
    const matchId =
        createMatchV13();

    const match =
        tournamentV13.matches.find(
            m => m.id === matchId
        );

    if (match && matchName) {
        match.name =
            String(matchName).trim();

        saveTournamentV13();
    }

    return matchId;
}


/* ---------------------------------------------------------
   LEADERBOARD
--------------------------------------------------------- */

function ASV14_getLeaderboard() {
    return getLeaderboardV13();
}


/* ---------------------------------------------------------
   DISPLAY
--------------------------------------------------------- */

function ASV14_renderLeaderboard(
    containerId
) {
    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    const leaderboard =
        getLeaderboardV13();

    if (!leaderboard.length) {
        container.innerHTML = `
            <div class="as-empty">
                No tournament results yet.
            </div>
        `;

        return;
    }

    container.innerHTML =
        leaderboard.map(team => `
            <div class="as-leaderboard-row">

                <div class="as-rank">
                    ${team.rank}
                </div>

                <div class="as-team">
                    ${ASV14_escape(team.team)}
                </div>

                <div class="as-matches">
                    ${team.matches}
                </div>

                <div class="as-kills">
                    ${team.kills}
                </div>

                <div class="as-points">
                    ${team.points}
                </div>

            </div>
        `).join("");
}


/* ---------------------------------------------------------
   HTML SAFETY
--------------------------------------------------------- */

function ASV14_escape(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ---------------------------------------------------------
   PUBLIC API
--------------------------------------------------------- */

window.AbsoluteScoreV14 = {

    importOCR:
        ASV14_importOCRResults,

    importExistingOCR:
        ASV14_importExistingOCR,

    createMatch:
        ASV14_createMatchFromOCR,

    leaderboard:
        ASV14_getLeaderboard,

    renderLeaderboard:
        ASV14_renderLeaderboard
};

console.log(
    "AbsoluteScore V14 OCR bridge loaded."
);
