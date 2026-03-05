export const formatQueueName = (queueName: string) => {
	// Remove YYYY-MM_ prefix pattern if present
	const cleanedName = queueName.replace(/^\d{4}-\d{2}_/, "");
	return cleanedName.replace(/_/g, " ").toUpperCase();
};
