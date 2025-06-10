export function buildErrorMessage(errorBody, defaultMsg) {
	let msg = errorBody.message || defaultMsg;
	if (errorBody.details && Array.isArray(errorBody.details) && errorBody.details.length > 0) {
		// Si hay varios detalles, los concatenamos
		msg = errorBody.details.join(', ');
	}
	return msg;
}
