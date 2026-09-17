export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      journeyId,
      eventType,
      latitude,
      longitude,
      battery,
      connectivity,
      checkpoint
    } = req.body || {};

    if (!journeyId || !eventType) {
      return res.status(400).json({
        success: false,
        error: "journeyId and eventType are required."
      });
    }

    const event = {
      journeyId,
      eventType,
      location: {
        latitude: latitude ?? null,
        longitude: longitude ?? null
      },
      battery: battery ?? null,
      connectivity: connectivity ?? null,
      checkpoint: checkpoint ?? null,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: "Journey event recorded.",
      event
    });

  } catch {
    return res.status(500).json({
      success: false,
      error: "Could not record journey event."
    });
  }
}
