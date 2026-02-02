export const getEventLogs = async (req, res) => {
  try {
    const { event_id } = req.params;
    const logs = await EventLogModel.find({ event: event_id }).sort({ createdAt: -1 });

    return sendSuccess(res, "Logs fetched successfully", 200, logs);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
