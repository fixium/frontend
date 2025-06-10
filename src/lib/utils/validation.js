/**
 * Valida que el nombre no contenga números.
 * @param {string} value - El valor del input.
 * @returns {string} - El valor sin números.
 */
export function validateName(value) {
	return value.replace(/\d/g, ''); // Eliminar números
}

/**
 * Valida que el número de teléfono no contenga letras.
 * @param {string} value - El valor del input.
 * @returns {string} - El valor solo con números.
 */
export function validatePhoneNumber(value) {
	return value.replace(/\D/g, ''); // Eliminar letras
}
