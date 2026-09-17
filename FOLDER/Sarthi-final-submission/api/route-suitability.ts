export default function handler(req: any, res: any) {
  try {
    const {
      duration = 30,
      cost = 50,
      walking = 10,
      transfers = 1,
      connectivity = "Normal",
      battery = 80,
      helpPoints = 3,
      rain = 0,
      windSpeed = 0,
      priority = "balanced",
    } = req.query;

    const d = Number(duration);
    const c = Number(cost);
    const w = Number(walking);
    const t = Number(transfers);
    const b = Number(battery);
    const h = Number(helpPoints);
    const rainValue = Number(rain);
    const wind = Number(windSpeed);

    const timeScore = Math.max(0, 1 - d / 120);
    const costScore = Math.max(0, 1 - c / 300);
    const walkingScore = Math.max(0, 1 - w / 60);
    const transferScore = Math.max(0, 1 - t / 4);
    const batteryScore = b / 100;
    const helpScore = Math.min(1, h / 5);

    const connectivityScore =
      connectivity === "Normal"
        ? 1
        : connectivity === "Unstable"
        ? 0.7
        : connectivity === "Low connectivity"
        ? 0.4
        : 0.2;

    const weatherPenalty =
      Math.min(0.35, rainValue * 0.15 + wind / 100);

    let score =
      timeScore * 0.18 +
      costScore * 0.12 +
      walkingScore * 0.15 +
      transferScore * 0.10 +
      batteryScore * 0.10 +
      connectivityScore * 0.15 +
      helpScore * 0.15;

    score -= weatherPenalty;

    if (priority === "fastest") {
      score += timeScore * 0.10;
    }

    if (priority === "low_cost") {
      score += costScore * 0.10;
    }

    if (priority === "less_walking") {
      score += walkingScore * 0.10;
    }

    score = Math.max(0, Math.min(1, score));

    return res.status(200).json({
      success: true,
      suitabilityScore: Number(score.toFixed(3)),
      recommendation:
        score >= 0.75
          ? "Strong fit for the current journey context."
          : score >= 0.55
          ? "Reasonable fit for the current journey context."
          : "Consider another available route.",
      factors: {
        timeScore: Number(timeScore.toFixed(2)),
        costScore: Number(costScore.toFixed(2)),
        walkingScore: Number(walkingScore.toFixed(2)),
        connectivityScore: Number(connectivityScore.toFixed(2)),
        batteryScore: Number(batteryScore.toFixed(2)),
        helpScore: Number(helpScore.toFixed(2)),
        weatherPenalty: Number(weatherPenalty.toFixed(2))
      },
      model: "Sarthi Context Suitability Model v2",
      generatedAt: new Date().toISOString()
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Suitability calculation failed."
    });
  }
}
