def calculate_scores(entries):
    """
    entries:
    [
        {"team": "NXS MPZ", "score": 120},
        {"team": "NXS MPZ", "score": 120},
        {"team": "NXS MPZ", "score": 90},
        {"team": "AERI", "score": 135}
    ]

    The exact same team + score is counted only once.
    """

    seen = set()
    totals = {}

    for entry in entries:
        team = entry["team"].strip()
        score = int(entry["score"])

        key = (team.upper(), score)

        # Ignore duplicate team + score
        if key in seen:
            continue

        seen.add(key)

        if team not in totals:
            totals[team] = 0

        totals[team] += score

    # Highest score first
    return sorted(
        totals.items(),
        key=lambda item: item[1],
        reverse=True
  )
